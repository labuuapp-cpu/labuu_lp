const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const PIXEL_CODE = "D9LP76JC77U97D5Q1GBG";
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

app.post("/track", async (req, res) => {
  if (!ACCESS_TOKEN) {
    console.error("TIKTOK_ACCESS_TOKEN not set");
    return res.status(500).json({ ok: false });
  }

  const { event, event_id, url, referrer } = req.body || {};
  if (!event) return res.status(400).json({ ok: false, error: "missing event" });

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const userAgent = req.headers["user-agent"] || "";

  const payload = {
    event_source: "web",
    event_source_id: PIXEL_CODE,
    data: [
      {
        event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || crypto.randomUUID(),
        user: { ip, user_agent: userAgent },
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

  res.json({ ok: true });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`api listening on ${PORT}`));
