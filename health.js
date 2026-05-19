// pages/api/health.js — Health check endpoint
// GET /api/health  →  { ok: true, ts: "...", wallet: bool, ai: bool }

export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    wallet: Boolean(process.env.NEXT_PUBLIC_WALLET_ADDRESS),
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
    chain: process.env.NEXT_PUBLIC_CHAIN || "polygon",
  });
}
