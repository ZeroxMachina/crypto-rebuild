/**
 * EXCHANGES — MASTER DATASET (canonical source of truth)
 * ----------------------------------------------------------------------------
 * This file replaces three fragmented, inconsistent legacy datasets:
 *   - src/data/exchanges.ts            (Product[] — had affiliate URLs)
 *   - src/lib/exchange-comparison.ts   (ExchangeComparisonData — 0–10 ratings)
 *   - src/components/ExchangeComparisonEngine.tsx (inline 8-exchange array)
 * Those disagreed on fees, coin counts, ratings scale, and security history.
 * New work should import from THIS file. Legacy files are deprecated and
 * pending migration.
 *
 * ACCURACY NOTES
 *  - Fees are base-tier (VIP 0) maker/taker rates, as a percentage
 *    (0.1 = 0.10%), BEFORE any exchange-token or volume discounts.
 *  - Coin counts are approximate — exchanges report them inconsistently.
 *  - Withdrawal fees are intentionally NOT included: they vary by asset and
 *    network and go stale fast. A future version should pull them live.
 *  - `dataConfidence` flags how solid an entry is. "needs-verification"
 *    entries must be checked against the exchange's official fee page
 *    before this dataset powers anything user-facing.
 *  - Ratings are degen0x editorial assessments on a 0–5 scale.
 */

export type DataConfidence = "high" | "medium" | "needs-verification";
export type Availability = "yes" | "restricted" | "no";
export type KycPolicy = "required" | "tiered" | "optional";

export interface ExchangeFee {
  /** base-tier maker fee, percent (0.1 = 0.10%) */
  maker: number;
  /** base-tier taker fee, percent */
  taker: number;
}

export interface Exchange {
  // Identity
  name: string;
  slug: string;
  founded: number;
  headquarters: string;
  publicCompany: boolean;
  regulated: boolean;

  // Access
  usAvailability: Availability;
  kyc: KycPolicy;

  // Fees (base tier, before token/volume discounts)
  spotFee: ExchangeFee;
  futuresTrading: boolean;
  /** null when no verified base futures rate is available */
  futuresFee: ExchangeFee | null;

  // Markets & features
  coins: number;
  marginTrading: boolean;
  stakingAvailable: boolean;
  fiatOnRamp: boolean;

  // Trust & security
  rating: number; // 0–5, editorial
  proofOfReserves: boolean;
  securityNotes: string; // honest — includes notable incidents

  // Monetization
  affiliateUrl: string;
  affiliateProgram: string;

  // Editorial
  bestFor: string;
  pros: string[];
  cons: string[];

  // Data integrity
  dataConfidence: DataConfidence;
  verifyNotes?: string;
}

/** Date this dataset was last compiled/reconciled. */
export const EXCHANGE_DATA_AS_OF = "2026-05-20";

export const EXCHANGE_METHODOLOGY =
  "Fees shown are base-tier (VIP 0) maker/taker rates before any exchange-token " +
  "or volume discounts. Data was compiled from exchange fee schedules and public " +
  "sources as of " +
  EXCHANGE_DATA_AS_OF +
  ". Entries flagged 'needs-verification' have conflicting figures across sources " +
  "and should be confirmed against the exchange's official fee page before relying " +
  "on them for large trades. Withdrawal fees vary by asset and network and are not " +
  "listed here. Ratings are degen0x editorial assessments on a 0–5 scale.";

export const exchanges: Exchange[] = [
  {
    name: "Binance",
    slug: "binance",
    founded: 2017,
    headquarters: "No official global HQ",
    publicCompany: false,
    regulated: false,
    usAvailability: "restricted",
    kyc: "required",
    spotFee: { maker: 0.1, taker: 0.1 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.05 },
    coins: 400,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.6,
    proofOfReserves: true,
    securityNotes:
      "Publishes zk-SNARK proof of reserves. A 2019 hot-wallet breach (~7,000 BTC) was covered by the SAFU insurance fund; no customer losses since.",
    affiliateUrl: "https://degen0x.com/go/binance",
    affiliateProgram: "Up to 50% lifetime trading-fee revenue share",
    bestFor: "Deepest liquidity and widest markets for non-US traders",
    pros: [
      "Largest trading volume and liquidity in crypto",
      "Low 0.10% base spot fee, lower with BNB",
      "Huge product range: spot, futures, earn, DeFi",
    ],
    cons: [
      "Not available to US users (Binance.US is a separate, limited entity)",
      "Ongoing regulatory scrutiny across jurisdictions",
    ],
    dataConfidence: "high",
  },
  {
    name: "Bybit",
    slug: "bybit",
    founded: 2018,
    headquarters: "Dubai, UAE",
    publicCompany: false,
    regulated: true,
    usAvailability: "no",
    kyc: "required",
    spotFee: { maker: 0.1, taker: 0.1 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.055 },
    coins: 650,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.2,
    proofOfReserves: true,
    securityNotes:
      "Publishes monthly proof of reserves. In February 2025 Bybit suffered the largest exchange hack in history — roughly $1.5B in ETH stolen via a compromised third-party wallet interface. Bybit replenished reserves within ~72 hours and no customer funds were lost.",
    affiliateUrl: "https://degen0x.com/go/bybit",
    affiliateProgram: "Up to 50% lifetime revenue share, no time cap",
    bestFor: "Derivatives and perpetuals traders",
    pros: [
      "Deep derivatives liquidity and fast execution",
      "Lifetime affiliate revenue share with no time cap",
      "Covered the 2025 hack in full — no user losses",
    ],
    cons: [
      "Suffered the largest exchange hack ever in February 2025",
      "Not available to US users",
    ],
    dataConfidence: "high",
  },
  {
    name: "OKX",
    slug: "okx",
    founded: 2017,
    headquarters: "Seychelles",
    publicCompany: false,
    regulated: true,
    usAvailability: "restricted",
    kyc: "required",
    spotFee: { maker: 0.08, taker: 0.1 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.05 },
    coins: 500,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.3,
    proofOfReserves: true,
    securityNotes:
      "Publishes monthly zk-STARK proof of reserves with reserve ratios at or above 100%. No major breach of customer funds reported.",
    affiliateUrl: "https://degen0x.com/go/okx",
    affiliateProgram: "Referral program with fee discounts; revenue-share rate unconfirmed",
    bestFor: "All-in-one trading plus Web3 wallet and DEX access",
    pros: [
      "Strong all-round spot and derivatives platform",
      "Well-integrated multi-chain Web3 wallet",
      "Consistent proof-of-reserves track record",
    ],
    cons: [
      "Restricted for US users; paid a $504M US settlement",
      "Affiliate commission terms not clearly published",
    ],
    dataConfidence: "high",
  },
  {
    name: "Coinbase",
    slug: "coinbase",
    founded: 2012,
    headquarters: "United States (remote-first; NASDAQ: COIN)",
    publicCompany: true,
    regulated: true,
    usAvailability: "yes",
    kyc: "required",
    spotFee: { maker: 0.6, taker: 1.2 },
    futuresTrading: true,
    futuresFee: null,
    coins: 300,
    marginTrading: false,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.4,
    proofOfReserves: false,
    securityNotes:
      "Publicly traded US company with audited financials and regulatory disclosures. No exchange-level breach of customer funds in its history.",
    affiliateUrl: "https://degen0x.com/go/coinbase",
    affiliateProgram: "Unconfirmed — current public affiliate terms not verified",
    bestFor: "US beginners who want regulation and easy fiat access",
    pros: [
      "Fully available and regulated in the US",
      "Publicly traded with audited financials",
      "Easiest fiat on-ramp and beginner UX",
    ],
    cons: [
      "High base trading fees on Coinbase Advanced (0.60% / 1.20%)",
      "Affiliate program terms currently unconfirmed",
    ],
    dataConfidence: "high",
  },
  {
    name: "Kraken",
    slug: "kraken",
    founded: 2011,
    headquarters: "Cheyenne, Wyoming, USA",
    publicCompany: false,
    regulated: true,
    usAvailability: "yes",
    kyc: "required",
    spotFee: { maker: 0.25, taker: 0.4 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.05 },
    coins: 300,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.5,
    proofOfReserves: true,
    securityNotes:
      "Long-standing strong security reputation; publishes third-party-verified proof of reserves. In April 2026 an insider-access incident exposed data on a small share of accounts (~0.02% of users) with no funds at risk.",
    affiliateUrl: "https://degen0x.com/go/kraken",
    affiliateProgram: "Affiliate program — 20% of referred users' trading fees",
    bestFor: "Security-conscious US traders",
    pros: [
      "Strong long-term security track record",
      "Fully available and regulated in the US",
      "Transparent, third-party-verified proof of reserves",
    ],
    cons: [
      "Base-tier spot fees higher than offshore exchanges",
      "Staking restricted for US users",
    ],
    dataConfidence: "high",
  },
  {
    name: "Bitget",
    slug: "bitget",
    founded: 2018,
    headquarters: "Seychelles",
    publicCompany: false,
    regulated: false,
    usAvailability: "no",
    kyc: "required",
    spotFee: { maker: 0.1, taker: 0.1 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.06 },
    coins: 800,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.1,
    proofOfReserves: true,
    securityNotes:
      "Publishes monthly proof of reserves (reserve ratio reported above 150%). No major breach reported.",
    affiliateUrl: "https://degen0x.com/go/bitget",
    affiliateProgram: "Affiliate program available; commission rate unconfirmed",
    bestFor: "Copy trading and derivatives for non-US traders",
    pros: [
      "Leading copy-trading platform",
      "Competitive 0.10% base spot fee",
      "Healthy proof-of-reserves ratio",
    ],
    cons: [
      "Not available to US users",
      "Affiliate commission rate not clearly published",
    ],
    dataConfidence: "medium",
    verifyNotes:
      "Bitget announced derivatives fee changes in May 2026 — confirm the current base futures rate.",
  },
  {
    name: "KuCoin",
    slug: "kucoin",
    founded: 2017,
    headquarters: "Seychelles",
    publicCompany: false,
    regulated: false,
    usAvailability: "no",
    kyc: "required",
    spotFee: { maker: 0.1, taker: 0.1 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.06 },
    coins: 700,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.1,
    proofOfReserves: true,
    securityNotes:
      "Publishes monthly proof of reserves. A 2020 hot-wallet hack (~$285M) was fully recovered or reimbursed with no customer losses.",
    affiliateUrl: "https://degen0x.com/go/kucoin",
    affiliateProgram: "Affiliate program — up to 60% trading-fee commission",
    bestFor: "Wide altcoin selection and early listings for non-US traders",
    pros: [
      "Large altcoin and early-listing selection",
      "High affiliate commission (up to 60%)",
      "Recovered fully from its 2020 hack",
    ],
    cons: [
      "Exited the US market — not available to US users",
      "Some listed tokens are high-risk micro-caps",
    ],
    dataConfidence: "high",
  },
  {
    name: "Gate.io",
    slug: "gate-io",
    founded: 2013,
    headquarters: "Cayman Islands",
    publicCompany: false,
    regulated: false,
    usAvailability: "no",
    kyc: "tiered",
    spotFee: { maker: 0.2, taker: 0.2 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.075 },
    coins: 2400,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.0,
    proofOfReserves: true,
    securityNotes:
      "Publishes proof of reserves (reserve ratio reported above 120%). No exchange-level breach has been formally confirmed.",
    affiliateUrl: "https://degen0x.com/go/gate-io",
    affiliateProgram: "Affiliate program — roughly 30–60% revenue share by tier",
    bestFor: "Traders hunting the widest range of small-cap tokens",
    pros: [
      "One of the largest token selections anywhere",
      "Transparent proof of reserves",
      "Generous tiered affiliate program",
    ],
    cons: [
      "Not available to US users",
      "Many listed tokens are highly speculative",
    ],
    dataConfidence: "high",
  },
  {
    name: "Crypto.com",
    slug: "crypto-com",
    founded: 2016,
    headquarters: "Singapore",
    publicCompany: false,
    regulated: true,
    usAvailability: "restricted",
    kyc: "required",
    spotFee: { maker: 0.25, taker: 0.5 },
    futuresTrading: true,
    futuresFee: { maker: 0.02, taker: 0.04 },
    coins: 250,
    marginTrading: false,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.2,
    proofOfReserves: true,
    securityNotes:
      "Publishes reserve transparency data. A January 2022 incident drained ~$34M from ~483 accounts via bypassed 2FA; Crypto.com reimbursed all affected users.",
    affiliateUrl: "https://degen0x.com/go/crypto-com",
    affiliateProgram: "Up to 50% trading-fee commission plus per-signup bonuses",
    bestFor: "Mainstream users who want a crypto card plus app investing",
    pros: [
      "Popular crypto Visa card with cashback",
      "All-in-one app: trade, earn, card, DeFi",
      "Generous affiliate program",
    ],
    cons: [
      "Base spot fees are high without CRO staking",
      "Card reward tiers require large CRO stakes",
    ],
    dataConfidence: "medium",
  },
  {
    name: "MEXC",
    slug: "mexc",
    founded: 2018,
    headquarters: "Seychelles",
    publicCompany: false,
    regulated: false,
    usAvailability: "no",
    kyc: "tiered",
    spotFee: { maker: 0, taker: 0.05 },
    futuresTrading: true,
    futuresFee: { maker: 0, taker: 0.02 },
    coins: 2000,
    marginTrading: true,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.0,
    proofOfReserves: true,
    securityNotes:
      "Publishes proof of reserves claiming 1:1 backing. No major breach reported.",
    affiliateUrl: "https://degen0x.com/go/mexc",
    affiliateProgram: "Affiliate program — commission reported up to ~70%",
    bestFor: "Earliest access to new and micro-cap listings at near-zero fees",
    pros: [
      "0% maker fees on spot and futures",
      "Among the fastest to list new tokens",
      "High affiliate commission",
    ],
    cons: [
      "Not available to US users",
      "Heavy concentration of speculative micro-caps",
    ],
    dataConfidence: "medium",
    verifyNotes:
      "Confirm current KYC policy (reported as both optional and tiered) and the exact affiliate commission rate.",
  },
  {
    name: "Gemini",
    slug: "gemini",
    founded: 2014,
    headquarters: "New York, USA",
    publicCompany: false,
    regulated: true,
    usAvailability: "yes",
    kyc: "required",
    spotFee: { maker: 0.6, taker: 1.2 },
    futuresTrading: false,
    futuresFee: null,
    coins: 150,
    marginTrading: false,
    stakingAvailable: true,
    fiatOnRamp: true,
    rating: 4.2,
    proofOfReserves: true,
    securityNotes:
      "Publishes monthly third-party reserve attestations and maintains an in-house captive insurer. No major breach of customer funds.",
    affiliateUrl: "https://degen0x.com/go/gemini",
    affiliateProgram: "Unconfirmed — current public affiliate terms not verified",
    bestFor: "US users who prioritize regulation and security over low fees",
    pros: [
      "Strong regulatory standing; available in all 50 US states",
      "Monthly reserve attestations plus in-house insurance",
      "Clean, simple interface",
    ],
    cons: [
      "High base trading fees",
      "No derivatives for US, EU, or UK users",
    ],
    dataConfidence: "high",
  },
  {
    name: "Bitstamp",
    slug: "bitstamp",
    founded: 2011,
    headquarters: "Luxembourg",
    publicCompany: false,
    regulated: true,
    usAvailability: "yes",
    kyc: "required",
    spotFee: { maker: 0.3, taker: 0.4 },
    futuresTrading: false,
    futuresFee: null,
    coins: 100,
    marginTrading: false,
    stakingAvailable: false,
    fiatOnRamp: true,
    rating: 4.0,
    proofOfReserves: false,
    securityNotes:
      "One of the longest-running exchanges; acquired by Robinhood in 2025. A 2015 phishing breach (~19,000 BTC) was fully compensated. Has historically not published full proof of reserves.",
    affiliateUrl: "https://degen0x.com/go/bitstamp",
    affiliateProgram: "Affiliate program — 50% of referred users' fees for the first 4 months",
    bestFor: "A simple, long-established fiat on-ramp for spot buyers",
    pros: [
      "Operating since 2011 with a long track record",
      "Now backed by Robinhood",
      "Simple, low-complexity interface",
    ],
    cons: [
      "Small coin selection, especially in the US",
      "Does not publish full proof of reserves",
    ],
    dataConfidence: "medium",
  },
];

/** All exchanges in the dataset. */
export function getAllExchanges(): Exchange[] {
  return exchanges;
}

/** Look up a single exchange by slug. */
export function getExchangeBySlug(slug: string): Exchange | undefined {
  return exchanges.find((e) => e.slug === slug);
}

/** Exchanges whose figures still need verification before launch. */
export function getExchangesNeedingVerification(): Exchange[] {
  return exchanges.filter((e) => e.dataConfidence === "needs-verification");
}

export type ExchangeSortKey =
  | "rating"
  | "spotMaker"
  | "spotTaker"
  | "coins"
  | "founded"
  | "name";

/** Sort a copy of the exchange list by a key. */
export function sortExchanges(
  key: ExchangeSortKey,
  direction: "asc" | "desc" = "desc",
  list: Exchange[] = exchanges
): Exchange[] {
  const value = (e: Exchange): number | string => {
    switch (key) {
      case "rating":
        return e.rating;
      case "spotMaker":
        return e.spotFee.maker;
      case "spotTaker":
        return e.spotFee.taker;
      case "coins":
        return e.coins;
      case "founded":
        return e.founded;
      case "name":
        return e.name.toLowerCase();
    }
  };
  return [...list].sort((a, b) => {
    const av = value(a);
    const bv = value(b);
    let cmp: number;
    if (typeof av === "number" && typeof bv === "number") {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return direction === "asc" ? cmp : -cmp;
  });
}

/** Filter the exchange list with a predicate. */
export function filterExchanges(
  predicate: (exchange: Exchange) => boolean
): Exchange[] {
  return exchanges.filter(predicate);
}
