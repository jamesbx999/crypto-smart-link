// components/WalletCard.jsx — Renders a single wallet button with deep link
import { useState } from "react";

export default function WalletCard({ wallet, context, labelOpen, isMobile }) {
  const [loading, setLoading] = useState(false);

  const link = isMobile
    ? wallet.deepLink?.(context)
    : wallet.universalLink?.(context) ?? wallet.deepLink?.(context);

  function handleClick(e) {
    if (!link) return;
    setLoading(true);
    // Small delay so the loading state is visible before redirect
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <a
      href={link || "#"}
      onClick={handleClick}
      target={wallet.id === "walletconnect" ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="wallet-card"
      style={{ "--accent": wallet.color }}
      aria-label={`${labelOpen} ${wallet.name}`}
    >
      <span className="wallet-icon" aria-hidden="true">
        {WALLET_EMOJI[wallet.id] ?? "💼"}
      </span>
      <span className="wallet-name">{wallet.name}</span>
      {wallet.note && <span className="wallet-note">{wallet.note}</span>}
      {loading && <span className="wallet-loading">↗</span>}

      <style jsx>{`
        .wallet-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, transform 0.12s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .wallet-card:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent);
          transform: translateY(-1px);
        }
        .wallet-card:active {
          transform: scale(0.98);
        }
        .wallet-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .wallet-name {
          font-size: 15px;
          font-weight: 600;
          flex: 1;
        }
        .wallet-note {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }
        .wallet-loading {
          font-size: 18px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </a>
  );
}

const WALLET_EMOJI = {
  metamask: "🦊",
  trust: "🛡️",
  coinbase: "🔵",
  rainbow: "🌈",
  walletconnect: "🔗",
};
