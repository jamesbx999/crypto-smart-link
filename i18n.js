// lib/i18n.js — Multi-language strings (EN / TH / JA)
// Usage: import { t } from "../lib/i18n"; then t("send", lang)

export const SUPPORTED_LANGS = ["en", "th", "ja"];

const translations = {
  // ── Page header ──────────────────────────────────────────
  title: {
    en: "Send Crypto",
    th: "ส่ง Crypto",
    ja: "暗号通貨を送る",
  },
  subtitle: {
    en: "Open with any wallet — just tap the button below",
    th: "เปิดด้วย wallet ใดก็ได้ — แตะปุ่มด้านล่าง",
    ja: "任意のウォレットで開く — 下のボタンをタップ",
  },
  // ── Wallet section ───────────────────────────────────────
  walletSectionTitle: {
    en: "Choose your wallet",
    th: "เลือก wallet ของคุณ",
    ja: "ウォレットを選択",
  },
  copyAddress: {
    en: "Copy address",
    th: "คัดลอกที่อยู่",
    ja: "アドレスをコピー",
  },
  copied: {
    en: "Copied!",
    th: "คัดลอกแล้ว!",
    ja: "コピーしました!",
  },
  openMetaMask: {
    en: "Open in MetaMask",
    th: "เปิดใน MetaMask",
    ja: "MetaMaskで開く",
  },
  openTrustWallet: {
    en: "Open in Trust Wallet",
    th: "เปิดใน Trust Wallet",
    ja: "Trust Walletで開く",
  },
  openCoinbase: {
    en: "Open in Coinbase Wallet",
    th: "เปิดใน Coinbase Wallet",
    ja: "Coinbase Walletで開く",
  },
  openRainbow: {
    en: "Open in Rainbow",
    th: "เปิดใน Rainbow",
    ja: "Rainbowで開く",
  },
  openWalletConnect: {
    en: "Connect via WalletConnect",
    th: "เชื่อมต่อผ่าน WalletConnect",
    ja: "WalletConnectで接続",
  },
  genericWallet: {
    en: "Open in browser wallet",
    th: "เปิดใน browser wallet",
    ja: "ブラウザウォレットで開く",
  },
  // ── Amount input ─────────────────────────────────────────
  amountLabel: {
    en: "Amount (optional)",
    th: "จำนวน (ไม่บังคับ)",
    ja: "金額（任意）",
  },
  amountPlaceholder: {
    en: "0.00",
    th: "0.00",
    ja: "0.00",
  },
  // ── Chatbot ──────────────────────────────────────────────
  chatTitle: {
    en: "Ask AI",
    th: "ถามผู้ช่วย AI",
    ja: "AIに質問",
  },
  chatPlaceholder: {
    en: "Ask anything about this payment…",
    th: "ถามเกี่ยวกับการชำระเงิน…",
    ja: "支払いについて質問する…",
  },
  chatSend: {
    en: "Send",
    th: "ส่ง",
    ja: "送信",
  },
  chatGreeting: {
    en: "Hi! I can help you send crypto, explain fees, or answer any questions about this page.",
    th: "สวัสดี! ฉันช่วยคุณส่ง crypto, อธิบายค่าธรรมเนียม หรือตอบคำถามใดๆ เกี่ยวกับหน้านี้",
    ja: "こんにちは！暗号通貨の送金や手数料の説明、このページに関する質問にお答えします。",
  },
  // ── Network badges ───────────────────────────────────────
  network: {
    en: "Network",
    th: "เครือข่าย",
    ja: "ネットワーク",
  },
  // ── Errors ───────────────────────────────────────────────
  errorGeneral: {
    en: "Something went wrong. Please try again.",
    th: "เกิดข้อผิดพลาด กรุณาลองใหม่",
    ja: "エラーが発生しました。もう一度お試しください。",
  },
};

/**
 * Translate a key into the requested language.
 * Falls back to English if the key or lang is missing.
 * @param {string} key - Translation key
 * @param {string} lang - "en" | "th" | "ja"
 * @returns {string}
 */
export function t(key, lang = "en") {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry["en"] ?? key;
}

/**
 * Detect browser language and map to supported lang code.
 * Call client-side only.
 * @returns {"en"|"th"|"ja"}
 */
export function detectLang() {
  if (typeof navigator === "undefined") return "en";
  const raw = navigator.language?.slice(0, 2).toLowerCase();
  if (raw === "th") return "th";
  if (raw === "ja") return "ja";
  return "en";
}
