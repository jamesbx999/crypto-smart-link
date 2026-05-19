// pages/api/chat.js — AI chatbot API route
// POST /api/chat   body: { messages: [{role, content}], lang: "en"|"th"|"ja" }

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPTS = {
  en: `You are a helpful assistant on a crypto payment page.
The page helps users send USDT or USDC on BNB Chain (BEP20, chain ID 56) using deep links to wallets like MetaMask and Trust Wallet.
Answer questions about: how to send USDT/USDC on BNB Chain, gas fees (paid in BNB), BEP20 vs other networks, wallet compatibility, and how to use this page.
Important: always remind users to select BNB Chain / BSC network in their wallet, not Ethereum or Polygon, or the transaction will fail.
Be concise, friendly, and practical. Do not give financial advice.`,

  th: `คุณเป็นผู้ช่วยบนหน้าชำระเงิน crypto
หน้านี้ช่วยให้ผู้ใช้ส่ง USDT หรือ USDC บน BNB Chain (BEP20, chain ID 56) ผ่าน deep links ไปยัง wallet เช่น MetaMask และ Trust Wallet
ตอบคำถามเกี่ยวกับ: การส่ง USDT/USDC บน BNB Chain, ค่า gas (จ่ายเป็น BNB), ความแตกต่างระหว่าง BEP20 กับเครือข่ายอื่น, wallet compatibility และวิธีใช้หน้านี้
สำคัญ: เตือนผู้ใช้เสมอให้เลือก BNB Chain / BSC ใน wallet ไม่ใช่ Ethereum หรือ Polygon
กระชับ เป็นมิตร และใช้งานได้จริง ไม่ให้คำแนะนำทางการเงิน`,

  ja: `あなたは暗号通貨決済ページのアシスタントです。
このページはMetaMaskやTrust WalletなどのウォレットのディープリンクでBNBチェーン（BEP20、チェーンID 56）上のUSDTまたはUSDCを送るのを助けます。
以下について答えてください：BNBチェーンでのUSDT/USDCの送り方、ガス代（BNBで支払い）、BEP20と他のネットワークの違い、ウォレットの互換性、このページの使い方。
重要：ウォレットでBNBチェーン/BSCネットワークを選択するようユーザーに必ず伝えてください（EthereumやPolygonではなく）。
簡潔で親切に答えてください。金融アドバイスは行わないでください。`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, lang = "en" } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Sanitize: only keep role + content, limit history to last 10 turns
  const sanitized = messages
    .slice(-10)
    .filter((m) => m.role && m.content)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPTS[lang] ?? SYSTEM_PROMPTS.en,
      messages: sanitized,
    });

    const text = response.content?.[0]?.text ?? "";
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}
