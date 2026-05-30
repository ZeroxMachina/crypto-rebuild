/**
 * Premium editorial layer for exchange reviews — sits on top of the verified
 * `exchanges` dataset. Sub-scores and prose are editorial; where a slug has no
 * entry here, the review page falls back to deriveScores() + the auto verdict.
 */
import { exchanges, type Exchange } from "./exchanges";

export interface SubScore {
  label: string;
  /** 0–10 */
  value: number;
}

export interface EditorialSection {
  heading: string;
  body: string;
}

export interface ReviewDetail {
  /** Editorial sub-scores (0–10). Overrides deriveScores when present. */
  scores?: SubScore[];
  fiat?: string[];
  funding?: string[];
  editorial?: EditorialSection[];
  /** Peer exchange slugs to compare against. */
  peers?: string[];
}

export const REVIEW_DETAILS: Record<string, ReviewDetail> = {
  bitstamp: {
    scores: [
      { label: "Fees", value: 6 },
      { label: "Security & trust", value: 9 },
      { label: "Ease of use", value: 8 },
      { label: "Asset range", value: 4 },
      { label: "Liquidity", value: 7 },
      { label: "Support & track record", value: 8 },
    ],
    fiat: ["USD", "EUR", "GBP"],
    funding: ["SEPA transfer", "International wire (SWIFT)", "Debit / credit card", "Apple Pay & Google Pay"],
    peers: ["kraken", "coinbase", "gemini"],
    editorial: [
      {
        heading: "Who Bitstamp is for",
        body:
          "Bitstamp is the exchange I point people to when they value a long, clean track record over bells and whistles. Launched in 2011, it is one of the oldest crypto exchanges still operating, it has never suffered a catastrophic customer-funds loss, and it leans hard into regulatory compliance across the EU, UK, and US. If you mainly want to buy and hold the major coins through a simple, well-audited fiat on-ramp — and you sleep better with a veteran venue than a two-year-old one — Bitstamp earns its place.",
      },
      {
        heading: "Who should look elsewhere",
        body:
          "Bitstamp is not for everyone. Its asset list is deliberately narrow — a few dozen coins versus the hundreds on Binance or KuCoin — so altcoin hunters will feel boxed in. There are no advanced derivatives or perpetuals, and its base trading fees (0.30% maker / 0.40% taker) sit above discount venues like Binance or MEXC. High-frequency or fee-sensitive traders will save real money elsewhere; degens chasing new listings will simply find they aren't there.",
      },
      {
        heading: "How the fees actually work",
        body:
          "The headline 0.30% / 0.40% is the base tier; fees step down as your 30-day volume rises, reaching well under 0.10% for serious size. The catch most newcomers hit is the convenience products — 'instant' card buys carry a noticeably higher spread than placing an order on the trading interface. If you care about cost, fund via SEPA or wire and trade on the Pro/standard interface rather than one-click buying.",
      },
      {
        heading: "Getting started",
        body:
          "Sign up, complete identity verification (required — Bitstamp is fully KYC'd), and fund in USD, EUR, or GBP via SEPA, wire, or card. SEPA deposits are typically free and land within a business day; card is instant but pricier. From there you can trade the listed pairs on a clean, beginner-friendly interface.",
      },
      {
        heading: "Bitstamp in 2026: under Robinhood",
        body:
          "An important ownership change: in 2024 Robinhood agreed to acquire Bitstamp, a deal reported to close in 2025. The practical effect for users is still settling out — expect tighter integration with Robinhood's ecosystem over time. We flag this as a developing situation; confirm current ownership terms and any product changes on Bitstamp's own site before acting.",
      },
    ],
  },
};

// ── Brand accent colors (for the monogram logo tile; colors aren't logos) ─────
const BRAND_COLORS: Record<string, string> = {
  binance: "#F0B90B",
  bybit: "#F7A600",
  okx: "#1DA1A1",
  coinbase: "#0052FF",
  kraken: "#5741D9",
  bitget: "#1DA2FF",
  kucoin: "#23AF91",
  "gate-io": "#2354E6",
  "crypto-com": "#103A8B",
  mexc: "#00B897",
  gemini: "#26B6C9",
  bitstamp: "#00A23B",
};

export function brandColor(slug: string): string {
  return BRAND_COLORS[slug] ?? "#6366f1";
}

// ── Derived sub-scores (fallback for exchanges without editorial scores) ──────
const TAKERS = exchanges.map((e) => e.spotFee.taker);
const MIN_T = Math.min(...TAKERS);
const MAX_T = Math.max(...TAKERS);
const MAX_COINS = Math.max(...exchanges.map((e) => e.coins));

function clamp(n: number, lo = 0, hi = 10): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Transparent derivation from the verified dataset so every exchange gets a
 * scorecard. Basis: cheaper fees, stronger trust signals, broader assets, and
 * easier access score higher. Editorial `scores` override this when present.
 */
export function deriveScores(e: Exchange): SubScore[] {
  const feeNorm = MAX_T === MIN_T ? 0 : (e.spotFee.taker - MIN_T) / (MAX_T - MIN_T);
  const fees = clamp(Math.round(10 - feeNorm * 6)); // cheapest=10, priciest≈4
  const security = clamp(
    Math.round((e.rating / 5) * 7 + (e.proofOfReserves ? 1.5 : 0) + (e.regulated ? 1.5 : 0))
  );
  const assets = clamp(Math.round(3 + (e.coins / MAX_COINS) * 7));
  const access = clamp(
    Math.round((e.usAvailability === "yes" ? 9 : e.usAvailability === "restricted" ? 6 : 5) + (e.fiatOnRamp ? 0.5 : -0.5))
  );
  return [
    { label: "Fees", value: fees },
    { label: "Security & trust", value: security },
    { label: "Asset range", value: assets },
    { label: "Accessibility", value: access },
  ];
}

export function getReviewDetail(slug: string): ReviewDetail | undefined {
  return REVIEW_DETAILS[slug];
}
