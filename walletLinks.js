// lib/walletLinks.js — Deep link builder for MetaMask, Trust Wallet, etc.
// Supports EIP-681 (ethereum: URI) & wallet-specific schemes.
// BNB Chain (BEP20) — chain ID 56

/** BEP20 token contract addresses on BNB Chain */
export const BEP20_TOKENS = {
  USDT: "0x55d398326f99059fF775485246999027B3197955", // BSC USDT
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // BSC USDC
};

/**
 * Build an EIP-681 URI for a BEP20 token transfer.
 * Format: ethereum:<contract>@56/transfer?address=<to>&uint256=<amount>
 */
export function buildEIP681URI({ address, chainId = 56, amount, token }) {
  const contractAddress = BEP20_TOKENS[token];

  // Token transfer (USDT/USDC): call transfer(address,uint256) on contract
  if (contractAddress && amount) {
    const amountWei = toTokenUnits(amount, 18); // USDT & USDC on BSC = 18 decimals
    return `ethereum:${contractAddress}@${chainId}/transfer?address=${address}&uint256=${amountWei}`;
  }

  // Token transfer without amount
  if (contractAddress) {
    return `ethereum:${contractAddress}@${chainId}/transfer?address=${address}`;
  }

  // Native BNB fallback
  const base = `ethereum:${address}@${chainId}`;
  return amount ? `${base}?value=${toWei(amount)}` : base;
}

/** Convert human amount to token units (18 decimals for BSC USDT/USDC) */
function toTokenUnits(amount, decimals = 18) {
  try {
    return String(Math.round(parseFloat(amount) * Math.pow(10, decimals)));
  } catch {
    return "0";
  }
}

/** Convert ETH/BNB amount string to wei */
function toWei(bnb) {
  try {
    return String(Math.round(parseFloat(bnb) * 1e18));
  } catch {
    return "0";
  }
}

/**
 * All wallet deep link builders.
 * Each receives { address, chainId, amount, token } and returns a URL string.
 */
export const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/icons/metamask.svg",
    color: "#F6851B",
    deepLink: ({ address, chainId, amount, token }) => {
      return `https://metamask.app.link/send/${BEP20_TOKENS[token] ?? address}@${chainId}/transfer?address=${address}${amount ? `&uint256=${toTokenUnits(amount)}` : ""}`;
    },
    universalLink: ({ address, chainId, amount, token }) => {
      return buildEIP681URI({ address, chainId, amount, token });
    },
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "/icons/trust.svg",
    color: "#3375BB",
    deepLink: ({ address, chainId, amount, token }) => {
      // Trust Wallet BEP20 deep link
      const contractAddress = BEP20_TOKENS[token] ?? "";
      return `trust://send?coin=20000714&token_id=${contractAddress}&address=${address}${amount ? `&amount=${amount}` : ""}`;
    },
    universalLink: ({ address, chainId, amount, token }) => {
      return `https://link.trustwallet.com/send?coin=20000714&token_id=${BEP20_TOKENS[token] ?? ""}&address=${address}${amount ? `&amount=${amount}` : ""}`;
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/icons/coinbase.svg",
    color: "#1652F0",
    deepLink: ({ address, chainId, amount, token }) => {
      return `https://go.cb-w.com/send?address=${address}&chain=${chainId}&token=${token}${amount ? `&amount=${amount}` : ""}`;
    },
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "/icons/rainbow.svg",
    color: "#FF4EEF",
    deepLink: ({ address, chainId, amount, token }) => {
      return `https://rnbwapp.com/send?address=${address}&chain=${chainId}&token=${token}${amount ? `&amount=${amount}` : ""}`;
    },
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "/icons/walletconnect.svg",
    color: "#3B99FC",
    deepLink: () => "https://walletconnect.com/",
    note: "Opens WalletConnect modal — scan QR with any wallet",
  },
];

/**
 * Detect best wallet to show first based on user agent.
 */
export function detectPrimaryWallet() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("trust")) return "trust";
  if (ua.includes("metamask") || window?.ethereum?.isMetaMask) return "metamask";
  if (ua.includes("coinbase")) return "coinbase";
  if (ua.includes("rainbow")) return "rainbow";
  return null;
}

/** Map chain name to chain ID */
export const CHAIN_IDS = {
  ethereum: 1,
  polygon:  137,
  bsc:      56,   // BNB Chain (BEP20)
  arbitrum: 42161,
  optimism: 10,
  base:     8453,
  avalanche:43114,
};

export function getChainId(chainName) {
  return CHAIN_IDS[chainName?.toLowerCase()] ?? 56; // default BNB Chain
}

