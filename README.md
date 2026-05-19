# 🔗 Crypto Smart Link Page

A Next.js app for receiving crypto payments via deep links to MetaMask, Trust Wallet, Coinbase Wallet, Rainbow, and WalletConnect — with a multi-language AI chatbot.

## ✅ Features

| Feature | Details |
|---|---|
| Smart wallet deep links | MetaMask, Trust Wallet, Coinbase Wallet, Rainbow, WalletConnect |
| EIP-681 URI support | Standard ethereum: URI for universal compatibility |
| Multi-language | English 🇺🇸 · Thai 🇹🇭 · Japanese 🇯🇵 (auto-detect) |
| AI Chatbot | Powered by Claude (Anthropic API) |
| Amount input | Dynamic amounts embedded in deep links |
| One-tap copy | Copy wallet address to clipboard |
| API routes | `/api/chat`, `/api/wallet`, `/api/health` |
| Mobile-first | Deep links open wallet apps on mobile |

---

## 🚀 Quick Deploy to Vercel

### 1. Clone & install
```bash
git clone <your-repo>
cd crypto-smart-link
npm install
```

### 2. Set environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

### 3. Deploy
```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and it will auto-deploy.

---

## ⚙️ Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key |
| `NEXT_PUBLIC_WALLET_ADDRESS` | ✅ | Your wallet address |
| `NEXT_PUBLIC_CHAIN` | ✅ | `polygon`, `ethereum`, `bsc`, `arbitrum` |
| `NEXT_PUBLIC_DISPLAY_NAME` | Optional | ENS name or display name |
| `NEXT_PUBLIC_DEFAULT_TOKEN` | Optional | Token symbol (USDC, ETH, etc.) |

---

## 📁 File Structure

```
crypto-smart-link/
├── pages/
│   ├── index.js          # Main Smart Link page
│   ├── _app.js           # Next.js app wrapper
│   └── api/
│       ├── chat.js       # POST /api/chat — AI chatbot
│       ├── wallet.js     # GET  /api/wallet — deep link builder
│       └── health.js     # GET  /api/health — health check
├── components/
│   ├── WalletCard.jsx    # Individual wallet button
│   └── ChatBot.jsx       # Floating AI chat widget
├── lib/
│   ├── i18n.js           # Multi-language strings
│   └── walletLinks.js    # Deep link builder logic
├── styles/
│   └── globals.css
├── .env.local.example
├── next.config.js
└── package.json
```

---

## 🔌 API Reference

### `POST /api/chat`
AI chatbot powered by Claude.
```json
// Request body
{ "messages": [{"role": "user", "content": "How do I send MATIC?"}], "lang": "en" }

// Response
{ "reply": "To send MATIC on Polygon..." }
```

### `GET /api/wallet`
Get deep links for a specific wallet.
```
/api/wallet?wallet=metamask&amount=10&chain=polygon
```
```json
{
  "wallet": "metamask",
  "name": "MetaMask",
  "deepLink": "https://metamask.app.link/send/0x...",
  "universalLink": "ethereum:0x...@137?value=10000000000000000000",
  "eip681": "ethereum:0x...@137",
  "chainId": 137
}
```

### `GET /api/health`
Health check — verify config.
```json
{ "ok": true, "wallet": true, "ai": true, "chain": "polygon" }
```

---

## 🌐 Supported Wallets & Deep Links

| Wallet | Mobile Deep Link | Desktop |
|---|---|---|
| MetaMask | `metamask.app.link/send/...` | Browser extension |
| Trust Wallet | `trust://send?...` | — |
| Coinbase Wallet | `go.cb-w.com/send?...` | Browser extension |
| Rainbow | `rnbwapp.com/send?...` | — |
| WalletConnect | QR code scan | WalletConnect modal |

---

## 🔒 Security Notes

- Never commit `.env.local` to git
- Add `.env.local` to `.gitignore`
- The `ANTHROPIC_API_KEY` is server-only (never exposed to browser)
- Wallet address is public (`NEXT_PUBLIC_*`) by design
