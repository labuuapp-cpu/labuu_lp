const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
app.disable("x-powered-by");

// Only trust X-Forwarded-For when explicitly behind a known proxy (e.g. TRUST_PROXY=1 for one hop).
const TRUST_PROXY = process.env.TRUST_PROXY;
app.set("trust proxy", TRUST_PROXY ? (/^\d+$/.test(TRUST_PROXY) ? Number(TRUST_PROXY) : TRUST_PROXY) : false);

app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=15552000",
  });
  next();
});

app.use(express.json());

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");
const PIXEL_CODE = "D9LP76JC77U97D5Q1GBG";
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MIN_PASSWORD_LENGTH = 8;

// Hash used to spend the same scrypt time when a phone isn't registered (prevents user enumeration by timing).
const DUMMY_HASH = hashPassword(crypto.randomBytes(16).toString("hex"));

// In-memory limiter that counts failed attempts per key within a sliding window.
function createFailureLimiter({ max, windowMs }) {
  const failures = new Map();
  function recent(key) {
    const now = Date.now();
    const list = (failures.get(key) || []).filter((t) => now - t < windowMs);
    if (list.length) failures.set(key, list);
    else failures.delete(key);
    return list;
  }
  return {
    isBlocked: (key) => recent(key).length >= max,
    fail: (key) => failures.set(key, [...recent(key), Date.now()]),
    reset: (key) => failures.delete(key),
  };
}

const FIFTEEN_MIN = 15 * 60 * 1000;
const loginByPhone = createFailureLimiter({ max: 10, windowMs: FIFTEEN_MIN });
const loginByIp = createFailureLimiter({ max: 50, windowMs: FIFTEEN_MIN });
const adminByIp = createFailureLimiter({ max: 10, windowMs: FIFTEEN_MIN });

function tooManyAttempts(res) {
  res.set("Retry-After", String(FIFTEEN_MIN / 1000));
  res.status(429).json({ ok: false, error: "too_many_attempts" });
}

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
  if (adminByIp.isBlocked(req.ip)) {
    tooManyAttempts(res);
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
    // Browsers send an unauthenticated probe before prompting; only count real attempts.
    if (auth) adminByIp.fail(req.ip);
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
    let s = value === undefined || value === null ? "" : String(value);
    // Neutralize spreadsheet formulas (CSV injection) by forcing the cell to text.
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
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

  const ip = req.ip || "";
  const userAgent = req.headers["user-agent"] || "";

  sendTikTokEvent({ event, event_id, url, referrer, ip, userAgent });
});

app.post("/api/lead", async (req, res) => {
  const { nome, telefone, email, senha, interesse, cidade, uf, especialidade, dificuldade } = req.body || {};

  const telefoneDigits = normalizePhone(telefone);
  const emailNormalized = (email || "").trim().toLowerCase();
  if (!nome || !nome.trim() || telefoneDigits.length < 10 || !isValidEmail(email) ||
    typeof senha !== "string" || senha.length < MIN_PASSWORD_LENGTH || !interesse || !cidade || !especialidade || !dificuldade) {
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

  const ip = req.ip || "";
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
  if (telefoneDigits.length < 10 || typeof senha !== "string" || !senha) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }
  if (loginByPhone.isBlocked(telefoneDigits) || loginByIp.isBlocked(req.ip)) {
    tooManyAttempts(res);
    return;
  }

  const lead = readLeads().find((l) => l.telefone && normalizePhone(l.telefone) === telefoneDigits);
  // Always run scrypt so response time doesn't reveal whether the phone is registered.
  const passwordOk = verifyPassword(senha, lead ? lead.senhaHash : DUMMY_HASH);
  const matched = Boolean(lead) && passwordOk;

  if (!matched) {
    loginByPhone.fail(telefoneDigits);
    loginByIp.fail(req.ip);
    res.status(401).json({ ok: false, error: "invalid_credentials" });
    return;
  }
  loginByPhone.reset(telefoneDigits);
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
  // Never expose password hashes or IPs, even to the admin UI.
  res.json(readLeads().map(({ senhaHash, ip, ...lead }) => lead));
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

// Generic error handler: never leak stack traces or file paths to the client.
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ ok: false, error: status === 413 ? "payload_too_large" : status < 500 ? "bad_request" : "server_error" });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
