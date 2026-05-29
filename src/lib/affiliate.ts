/**
 * Affiliate partners. All outbound affiliate clicks route through /go/[partner]
 * for tracking and UTM attachment. estimatedCpa notes are honest — "unconfirmed"
 * where terms aren't verified, "No standard affiliate" where none exists.
 */
export interface AffiliatePartner {
  slug: string;
  name: string;
  fallbackUrl: string;
  category: "exchange" | "dex" | "wallet" | "tax" | "card";
  commissionType: "cpa" | "revenue_share" | "none";
  estimatedCpa?: string;
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // Exchanges
  { slug: "binance", name: "Binance", fallbackUrl: "https://binance.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Up to 50% lifetime fees" },
  { slug: "bybit", name: "Bybit", fallbackUrl: "https://bybit.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Up to 50% lifetime, no cap" },
  { slug: "okx", name: "OKX", fallbackUrl: "https://okx.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Referral; rate unconfirmed" },
  { slug: "coinbase", name: "Coinbase", fallbackUrl: "https://coinbase.com", category: "exchange", commissionType: "cpa", estimatedCpa: "Unconfirmed" },
  { slug: "kraken", name: "Kraken", fallbackUrl: "https://kraken.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "20% of referred fees" },
  { slug: "bitget", name: "Bitget", fallbackUrl: "https://bitget.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Affiliate; rate unconfirmed" },
  { slug: "kucoin", name: "KuCoin", fallbackUrl: "https://kucoin.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Up to 60% commission" },
  { slug: "gate-io", name: "Gate.io", fallbackUrl: "https://gate.io", category: "exchange", commissionType: "revenue_share", estimatedCpa: "~30–60% by tier" },
  { slug: "crypto-com", name: "Crypto.com", fallbackUrl: "https://crypto.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Up to 50% + bonuses" },
  { slug: "mexc", name: "MEXC", fallbackUrl: "https://mexc.com", category: "exchange", commissionType: "revenue_share", estimatedCpa: "Up to ~70% reported" },
  { slug: "gemini", name: "Gemini", fallbackUrl: "https://gemini.com", category: "exchange", commissionType: "cpa", estimatedCpa: "Unconfirmed" },
  { slug: "bitstamp", name: "Bitstamp", fallbackUrl: "https://bitstamp.net", category: "exchange", commissionType: "revenue_share", estimatedCpa: "50% fees, first 4 months" },

  // DEXes
  { slug: "uniswap", name: "Uniswap", fallbackUrl: "https://app.uniswap.org", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },
  { slug: "pancakeswap", name: "PancakeSwap", fallbackUrl: "https://pancakeswap.finance", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },
  { slug: "hyperliquid", name: "Hyperliquid", fallbackUrl: "https://app.hyperliquid.xyz", category: "dex", commissionType: "revenue_share", estimatedCpa: "10% of referred taker fees" },
  { slug: "jupiter", name: "Jupiter", fallbackUrl: "https://jup.ag", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },
  { slug: "dydx", name: "dYdX", fallbackUrl: "https://dydx.exchange", category: "dex", commissionType: "revenue_share", estimatedCpa: "Affiliate fee share" },
  { slug: "gmx", name: "GMX", fallbackUrl: "https://app.gmx.io", category: "dex", commissionType: "revenue_share", estimatedCpa: "Referral rebate" },
  { slug: "curve", name: "Curve Finance", fallbackUrl: "https://curve.fi", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },
  { slug: "aerodrome", name: "Aerodrome", fallbackUrl: "https://aerodrome.finance", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },
  { slug: "raydium", name: "Raydium", fallbackUrl: "https://raydium.io", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },
  { slug: "1inch", name: "1inch", fallbackUrl: "https://app.1inch.io", category: "dex", commissionType: "none", estimatedCpa: "No standard affiliate" },

  // Wallets / Tax / Cards (for upcoming verticals)
  { slug: "ledger", name: "Ledger", fallbackUrl: "https://ledger.com", category: "wallet", commissionType: "cpa", estimatedCpa: "~10% of sale" },
  { slug: "trezor", name: "Trezor", fallbackUrl: "https://trezor.io", category: "wallet", commissionType: "cpa", estimatedCpa: "~12% of sale" },
  { slug: "koinly", name: "Koinly", fallbackUrl: "https://koinly.io", category: "tax", commissionType: "cpa", estimatedCpa: "30% subscription" },
  { slug: "cointracker", name: "CoinTracker", fallbackUrl: "https://cointracker.io", category: "tax", commissionType: "cpa", estimatedCpa: "25% subscription" },
  { slug: "nexo", name: "Nexo", fallbackUrl: "https://nexo.com", category: "card", commissionType: "cpa", estimatedCpa: "$25" },
];

export function getPartner(slug: string): AffiliatePartner | undefined {
  return AFFILIATE_PARTNERS.find((p) => p.slug === slug);
}
