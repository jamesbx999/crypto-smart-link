// pages/index.js — Smart Link Page (crypto send/receive)
import { useState, useEffect } from "react";
import Head from "next/head";
import { t, detectLang, SUPPORTED_LANGS } from "../lib/i18n";
import { WALLETS, getChainId, detectPrimaryWallet } from "../lib/walletLinks";
import WalletCard from "../components/WalletCard";
import ChatBot from "../components/ChatBot";

const CHAIN = process.env.NEXT_PUBLIC_CHAIN || "bsc";
const WALLET_ADDRESS = process.env.NEXT_PUBLIC_WALLET_ADDRESS || "";
const DISPLAY_NAME = process.env.NEXT_PUBLIC_DISPLAY_NAME || "";
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN || "USDT";

const CHAIN_LABELS = {
  bsc:      { label: "BNB Chain (BEP20)", color: "#F3BA2F", symbol: "BNB", stablecoins: ["USDT", "USDC"] },
  polygon:  { label: "Polygon",           color: "#8247E5", symbol: "MATIC", stablecoins: ["USDT", "USDC"] },
  ethereum: { label: "Ethereum",          color: "#627EEA", symbol: "ETH",  stablecoins: ["USDT", "USDC"] },
  arbitrum: { label: "Arbitrum",          color: "#28A0F0", symbol: "ETH",  stablecoins: ["USDT", "USDC"] },
  optimism: { label: "Optimism",          color: "#FF0420", symbol: "ETH",  stablecoins: ["USDT", "USDC"] },
  base:     { label: "Base",              color: "#0052FF", symbol: "ETH",  stablecoins: ["USDT", "USDC"] },
};

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(DEFAULT_TOKEN); // USDT | USDC
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLang(detectLang());
    setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
  }, []);

  const chainInfo = CHAIN_LABELS[CHAIN] ?? { label: CHAIN, color: "#888", symbol: DEFAULT_TOKEN };
  const chainId = getChainId(CHAIN);
  const shortAddress = WALLET_ADDRESS
    ? `${WALLET_ADDRESS.slice(0, 6)}…${WALLET_ADDRESS.slice(-4)}`
    : "—";

  const walletContext = { address: WALLET_ADDRESS, chainId, amount, token };

  async function copyAddress() {
    if (!WALLET_ADDRESS) return;
    await navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Head>
        <title>{DISPLAY_NAME || "Crypto Smart Link"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Send crypto — open with any wallet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page">
        {/* ── Background orbs ────────────────────────────── */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* ── Language switcher ──────────────────────────── */}
        <div className="lang-row">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l}
              className={`lang-btn ${lang === l ? "active" : ""}`}
              onClick={() => setLang(l)}
              aria-label={`Switch to ${l}`}
            >
              {LANG_FLAG[l]} {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── Main card ──────────────────────────────────── */}
        <main className="card">
          {/* Header */}
          <div className="card-header">
            <div className="avatar">💳</div>
            <div>
              <h1 className="title">{DISPLAY_NAME || t("title", lang)}</h1>
              <p className="subtitle">{t("subtitle", lang)}</p>
            </div>
          </div>

          {/* Network badge */}
          <div className="network-row">
            <span className="badge" style={{ background: chainInfo.color + "22", color: chainInfo.color, borderColor: chainInfo.color + "44" }}>
              ● {chainInfo.label}
            </span>
          </div>

          {/* Address row */}
          <div className="address-row">
            <code className="address">{shortAddress}</code>
            <button className="copy-btn" onClick={copyAddress} aria-label={t("copyAddress", lang)}>
              {copied ? `✓ ${t("copied", lang)}` : `⎘ ${t("copyAddress", lang)}`}
            </button>
          </div>

          {/* Token selector: USDT / USDC */}
          <div className="token-section">
            <div className="amount-label">Token</div>
            <div className="token-tabs">
              {(chainInfo.stablecoins || ["USDT", "USDC"]).map((tk) => (
                <button
                  key={tk}
                  className={`token-tab ${token === tk ? "active" : ""}`}
                  onClick={() => setToken(tk)}
                  aria-pressed={token === tk}
                >
                  {TOKEN_ICON[tk]} {tk}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div className="amount-section">
            <label className="amount-label" htmlFor="amount">
              {t("amountLabel", lang)} ({token})
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              placeholder={t("amountPlaceholder", lang)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
            />
          </div>

          {/* Divider */}
          <p className="section-label">{t("walletSectionTitle", lang)}</p>

          {/* Wallet buttons */}
          <div className="wallets-grid">
            {WALLETS.map((w) => (
              <WalletCard
                key={w.id}
                wallet={w}
                context={walletContext}
                labelOpen={t("openMetaMask", lang).replace("MetaMask", "")}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Footer hint */}
          <p className="footer-note">
            {isMobile
              ? "Tap a button to open your wallet app directly"
              : "On desktop: install the browser extension, or scan QR with your phone"}
          </p>
        </main>

        {/* ── AI Chatbot ────────────────────────────────── */}
        <ChatBot lang={lang} />
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #0d0e1a;
          color: #fff;
          min-height: 100vh;
        }
      `}</style>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px 100px;
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.25;
        }
        .orb-1 { width: 400px; height: 400px; background: #6c63ff; top: -80px; right: -80px; }
        .orb-2 { width: 300px; height: 300px; background: #3b82f6; bottom: -60px; left: -60px; }

        .lang-row {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          z-index: 1;
        }
        .lang-btn {
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .lang-btn.active, .lang-btn:hover {
          background: rgba(108,99,255,0.2);
          border-color: #6c63ff;
          color: #fff;
        }

        .card {
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 28px;
          backdrop-filter: blur(20px);
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6c63ff, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        .subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
          line-height: 1.4;
        }

        .network-row { display: flex; align-items: center; gap: 8px; }
        .badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 50px;
          border: 1px solid;
        }

        .address-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
        }
        .address {
          flex: 1;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          font-family: "SF Mono", "Fira Code", monospace;
          letter-spacing: 0.5px;
          word-break: break-all;
        }
        .copy-btn {
          flex-shrink: 0;
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .copy-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .token-section { display: flex; flex-direction: column; gap: 6px; }
        .token-tabs { display: flex; gap: 8px; }
        .token-tab {
          flex: 1;
          padding: 10px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all .15s;
        }
        .token-tab:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
        .token-tab.active {
          background: rgba(243,186,47,0.15);
          border-color: #F3BA2F;
          color: #F3BA2F;
        }

        .amount-section { display: flex; flex-direction: column; gap: 6px; }
        .amount-label { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 500; }
        .amount-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          padding: 12px 16px;
          outline: none;
          width: 100%;
          transition: border-color 0.15s;
        }
        .amount-input:focus { border-color: #F3BA2F; }
        .amount-input::placeholder { color: rgba(255,255,255,0.2); }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.35);
        }

        .wallets-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-note {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .card { padding: 20px; gap: 16px; }
        }
      `}</style>
    </>
  );
}

const LANG_FLAG = { en: "🇺🇸", th: "🇹🇭", ja: "🇯🇵" };

const TOKEN_ICON = { USDT: "💚", USDC: "🔵" };
