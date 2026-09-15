const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
app.use(express.json());

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");
const PIXEL_CODE = "D9LP76JC77U97D5Q1GBG";
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function normalizePhone(phone) {
  return (phone || "").replace(/\D/g, "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = crypto.scryptSync(password, salt, 64);
  return hashBuffer.length === candidateBuffer.length && crypto.timingSafeEqual(hashBuffer, candidateBuffer);
}

function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    res.status(503).send("Admin não configurado (defina ADMIN_PASSWORD).");
    return;
  }
  const auth = req.headers.authorization || "";
  const [scheme, encoded] = auth.split(" ");
  const decoded = scheme === "Basic" && encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
  const password = decoded.slice(decoded.indexOf(":") + 1);

  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!match) {
    res.set("WWW-Authenticate", 'Basic realm="Labuu Admin"');
    res.status(401).send("Autenticação necessária.");
    return;
  }
  next();
}

function readLeads() {
  let lines;
  try {
    lines = fs.readFileSync(LEADS_FILE, "utf8").split("\n").filter(Boolean);
  } catch (err) {
    return [];
  }
  const leads = [];
  for (const line of lines) {
    try {
      leads.push(JSON.parse(line));
    } catch (err) {
      // skip malformed line
    }
  }
  return leads.reverse();
}

function toCsv(leads) {
  const columns = ["ts", "nome", "telefone", "email", "interesse", "cidade", "uf", "especialidade", "dificuldade"];
  function escapeCell(value) {
    const s = value === undefined || value === null ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }
  const rows = [columns.join(",")];
  for (const lead of leads) {
    rows.push(columns.map((c) => escapeCell(lead[c])).join(","));
  }
  return rows.join("\n");
}

let citiesCache = null;
let citiesCacheAt = 0;
const CITIES_TTL_MS = 24 * 60 * 60 * 1000;

async function getCities() {
  if (citiesCache && Date.now() - citiesCacheAt < CITIES_TTL_MS) return citiesCache;
  const r = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
  const data = await r.json();
  citiesCache = data.map((m) => ({
    nome: m.nome,
    uf: m.microrregiao && m.microrregiao.mesorregiao && m.microrregiao.mesorregiao.UF ?
      m.microrregiao.mesorregiao.UF.sigla : "",
  }));
  citiesCacheAt = Date.now();
  return citiesCache;
}

async function sendTikTokEvent({ event, event_id, url, referrer, ip, userAgent, phone }) {
  if (!ACCESS_TOKEN) {
    console.error("TIKTOK_ACCESS_TOKEN not set");
    return;
  }

  const user = { ip, user_agent: userAgent };
  if (phone) {
    const digits = normalizePhone(phone);
    const e164 = digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
    user.phone_number = crypto.createHash("sha256").update(e164).digest("hex");
  }

  const payload = {
    event_source: "web",
    event_source_id: PIXEL_CODE,
    data: [
      {
        event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || crypto.randomUUID(),
        user,
        page: { url: url || "", referrer: referrer || "" },
      },
    ],
  };

  try {
    const r = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.code !== 0) {
      console.error("TikTok API error", r.status, data);
    }
  } catch (err) {
    console.error("TikTok API request failed", err);
  }
}

app.post("/api/track", (req, res) => {
  res.json({ ok: true });

  const { event, event_id, url, referrer } = req.body || {};
  if (!event) return;

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const userAgent = req.headers["user-agent"] || "";

  sendTikTokEvent({ event, event_id, url, referrer, ip, userAgent });
});

app.post("/api/lead", async (req, res) => {
  const { nome, telefone, email, senha, interesse, cidade, uf, especialidade, dificuldade } = req.body || {};

  const telefoneDigits = normalizePhone(telefone);
  const emailNormalized = (email || "").trim().toLowerCase();
  if (!nome || !nome.trim() || telefoneDigits.length < 10 || !isValidEmail(email) ||
    !senha || senha.length < 6 || !interesse || !cidade || !especialidade || !dificuldade) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  const existingLeads = readLeads();
  const duplicate = existingLeads.find((l) =>
    (l.telefone && normalizePhone(l.telefone) === telefoneDigits) ||
    (l.email && l.email.trim().toLowerCase() === emailNormalized)
  );
  if (duplicate) {
    const field = duplicate.telefone && normalizePhone(duplicate.telefone) === telefoneDigits ? "telefone" : "email";
    res.status(409).json({ ok: false, error: "already_registered", field });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const userAgent = req.headers["user-agent"] || "";

  const lead = {
    ts: new Date().toISOString(),
    nome,
    telefone,
    email: email.trim(),
    senhaHash: hashPassword(senha),
    interesse,
    cidade,
    uf: uf || "",
    especialidade,
    dificuldade,
    ip
  };

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(LEADS_FILE, JSON.stringify(lead) + "\n");
  } catch (err) {
    console.error("Failed to persist lead", err);
    res.status(500).json({ ok: false, error: "storage_failed" });
    return;
  }

  res.json({ ok: true });

  sendTikTokEvent({ event: "CompleteRegistration", url: req.headers.referer, ip, userAgent, phone: telefone });
});

app.post("/api/login", (req, res) => {
  const { telefone, senha } = req.body || {};
  const telefoneDigits = normalizePhone(telefone);
  if (telefoneDigits.length < 10 || !senha) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  let matched = false;
  try {
    const lines = fs.readFileSync(LEADS_FILE, "utf8").split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      const lead = JSON.parse(lines[i]);
      if (lead.telefone && normalizePhone(lead.telefone) === telefoneDigits) {
        matched = verifyPassword(senha, lead.senhaHash);
        break;
      }
    }
  } catch (err) {
    matched = false;
  }

  if (!matched) {
    res.status(401).json({ ok: false, error: "invalid_credentials" });
    return;
  }
  res.json({ ok: true });
});

app.get("/api/cidades", async (_req, res) => {
  try {
    const cities = await getCities();
    res.json(cities);
  } catch (err) {
    console.error("Failed to fetch IBGE cities", err);
    res.status(502).json(citiesCache || []);
  }
});

app.get("/admin", requireAdmin, (_req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/api/admin/leads", requireAdmin, (_req, res) => {
  res.json(readLeads());
});

app.get("/api/admin/leads.csv", requireAdmin, (_req, res) => {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
  res.send(toCsv(readLeads()));
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(express.static(PUBLIC_DIR));

app.get("*", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
