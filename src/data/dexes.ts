/**
 * DEXES — MASTER DATASET (canonical source of truth)
 * ----------------------------------------------------------------------------
 * Decentralized exchanges. Deliberately a SEPARATE schema from the CEX dataset
 * (exchanges-master.ts) — DEXes don't compare apples-to-apples with CEXes:
 *   - All DEXes are non-custodial and require no KYC (so those aren't per-row
 *     fields — they're stated once in the UI as a standing fact).
 *   - "Fees" means LP fee tiers / perp maker-taker / aggregator routing, not a
 *     single maker/taker pair — hence `feeModel` is a descriptive string.
 *   - TVL is meaningless for aggregators (they route through others' liquidity)
 *     — `tvl` is nullable and carries a `tvlNote` where it shouldn't be shown.
 *
 * MONETIZATION HONESTY: most DEXes are protocols, not companies, and do NOT run
 * CEX-style signup revenue-share affiliate programs. `referral` describes the
 * real mechanism per DEX; `hasReferralProgram` is true only where a genuine
 * referral/rebate program exists (Hyperliquid, GMX, dYdX).
 *
 * ACCURACY: figures compiled from DeFiLlama and public sources as of the date
 * below. Perp-DEX TVL/OI moves daily — refresh `needs-verification` entries
 * before this powers anything user-facing.
 */

import type { DataConfidence } from "./exchanges";

export type DexType = "AMM" | "Aggregator" | "Perp DEX";

export interface Dex {
  // Identity
  name: string;
  slug: string;
  type: DexType;
  launched: number;

  // Where it runs
  chains: string[];
  primaryChain: string;

  // Trading
  feeModel: string; // descriptive — fee structures are heterogeneous by type
  spot: boolean;
  perps: boolean;

  // Liquidity
  tvl: string | null; // approximate; null when TVL is not a meaningful metric
  tvlNote?: string;

  // Token & economics
  token: string; // governance/native token ticker, or "None"
  referral: string; // honest description of any referral / fee-share mechanism
  hasReferralProgram: boolean; // true only for genuine referral/rebate programs

  // Trust
  rating: number; // 0–5, editorial
  securityNotes: string;

  // Monetization
  affiliateUrl: string;

  // Editorial
  bestFor: string;
  pros: string[];
  cons: string[];

  // Data integrity
  dataConfidence: DataConfidence;
  verifyNotes?: string;
}

/** Date this dataset was last compiled/reconciled. */
export const DEX_DATA_AS_OF = "2026-05-20";

export const DEX_METHODOLOGY =
  "All DEXes listed are non-custodial and require no KYC — you trade from your " +
  "own wallet. Fee models differ by type: AMMs charge LP fee tiers, perp DEXes " +
  "charge maker/taker fees, and aggregators route for best execution. TVL is " +
  "shown where meaningful and omitted for aggregators, which hold little " +
  "liquidity of their own. Most DEXes do not run signup affiliate programs; the " +
  "referral column states the real mechanism. Data compiled from DeFiLlama and " +
  "public sources as of " +
  DEX_DATA_AS_OF +
  ". Perp-DEX TVL moves daily — treat figures as approximate.";

export const dexes: Dex[] = [
  {
    name: "Uniswap",
    slug: "uniswap",
    type: "AMM",
    launched: 2018,
    chains: [
      "Ethereum",
      "Arbitrum",
      "Optimism",
      "Base",
      "Polygon",
      "BNB Chain",
      "Unichain",
      "Avalanche",
    ],
    primaryChain: "Ethereum",
    feeModel:
      "LP fee tiers — v3: 0.01% / 0.05% / 0.30% / 1.00%; v2: flat 0.30%; v4: dynamic per-pool. A protocol fee is now active on several chains.",
    spot: true,
    perps: false,
    tvl: "~$4.95B",
    token: "UNI",
    referral:
      "No signup referral program. v4 hooks let builders capture fees on pools they deploy; the Uniswap front-end charges a small interface fee on some swaps.",
    hasReferralProgram: false,
    rating: 4.7,
    securityNotes:
      "Core v2/v3 contracts have a strong record with no protocol-level AMM exploit. Risk concentrates in malicious tokens/pools and front-end phishing, common to all DEXes.",
    affiliateUrl: "https://degen0x.com/go/uniswap",
    bestFor: "Deep-liquidity spot swaps across Ethereum and EVM L2s",
    pros: [
      "Deepest liquidity for ERC-20 spot trading",
      "Battle-tested contracts across many chains",
      "v4 hooks enable highly customizable pools",
    ],
    cons: [
      "Spot only — no perpetuals",
      "Ethereum mainnet gas can be costly for small swaps",
    ],
    dataConfidence: "high",
  },
  {
    name: "PancakeSwap",
    slug: "pancakeswap",
    type: "AMM",
    launched: 2020,
    chains: [
      "BNB Chain",
      "Ethereum",
      "Arbitrum",
      "Base",
      "Linea",
      "opBNB",
    ],
    primaryChain: "BNB Chain",
    feeModel:
      "LP fees, mostly ~0.25%; v3 concentrated-liquidity pools have multiple tiers. A share of fees funds protocol revenue.",
    spot: true,
    perps: true,
    tvl: "~$1.5B",
    token: "CAKE",
    referral:
      "No CEX-style affiliate program. A weekly share of trading fees is distributed to CAKE stakers.",
    hasReferralProgram: false,
    rating: 4.2,
    securityNotes:
      "No catastrophic protocol-level AMM exploit. Has had front-end DNS-hijack incidents (e.g. 2021) — not smart-contract breaches.",
    affiliateUrl: "https://degen0x.com/go/pancakeswap",
    bestFor: "Low-cost spot trading and yield farming on BNB Chain",
    pros: [
      "Largest DEX on BNB Chain with low fees",
      "Broad product range: swaps, farms, perps, prediction",
      "Retail-friendly multichain interface",
    ],
    cons: [
      "Most liquidity concentrated on BNB Chain",
      "Fee tiers vary across v2/v3/Infinity — can confuse LPs",
    ],
    dataConfidence: "medium",
    verifyNotes:
      "Confirm the current perps backend and pull a fresh May 2026 TVL figure.",
  },
  {
    name: "Hyperliquid",
    slug: "hyperliquid",
    type: "Perp DEX",
    launched: 2023,
    chains: ["Hyperliquid L1", "HyperEVM"],
    primaryChain: "Hyperliquid L1",
    feeModel:
      "Perp maker/taker — base ~0.015% maker / ~0.045% taker, scaling down with volume; discounts stack via HYPE staking and referral codes.",
    spot: true,
    perps: true,
    tvl: "~$6.2B",
    token: "HYPE",
    referral:
      "Yes — referrers earn 10% of referred users' taker fees (on each referee's first $1B of volume); referees get a 4% fee discount. Builder codes pay integrating apps up to 0.1% on perps and 1% on spot.",
    hasReferralProgram: true,
    rating: 4.6,
    securityNotes:
      "No protocol-level smart-contract exploit of the exchange. Notable stress event: the March 2025 JELLY low-cap manipulation, handled via the HLP vault — an oracle/risk-design event, not a contract hack.",
    affiliateUrl: "https://degen0x.com/go/hyperliquid",
    bestFor: "High-volume, low-latency on-chain perpetuals trading",
    pros: [
      "Leading perp DEX by volume in 2026",
      "Genuine referral program — 10% of referred taker fees",
      "On-chain order book with CEX-like speed",
    ],
    cons: [
      "Newer protocol with a shorter track record",
      "Perps carry high risk; not for beginners",
    ],
    dataConfidence: "medium",
    verifyNotes:
      "Perp-DEX TVL and open interest move daily — refresh from DeFiLlama before publishing.",
  },
  {
    name: "Jupiter",
    slug: "jupiter",
    type: "Aggregator",
    launched: 2021,
    chains: ["Solana"],
    primaryChain: "Solana",
    feeModel:
      "Aggregator — routes for best execution across 50+ Solana venues with no protocol swap fee on routing; integrators can attach a platform fee. Its perps product charges open/close/borrow fees.",
    spot: true,
    perps: true,
    tvl: "~$3B (includes the ~$1.3B JLP perps liquidity pool)",
    token: "JUP",
    referral:
      "No signup affiliate program. Integrators can set a referral fee on swaps routed through the Jupiter API; JLP holders earn 75% of perps platform fees.",
    hasReferralProgram: false,
    rating: 4.5,
    securityNotes:
      "No major exploit of the aggregator core. As a routing layer, its risk surface largely reflects the underlying DEXes it routes through.",
    affiliateUrl: "https://degen0x.com/go/jupiter",
    bestFor: "Best-execution token swaps on Solana",
    pros: [
      "Dominant Solana aggregator — best-price routing",
      "Combines spot aggregation with a native perps engine",
      "Deep coverage of Solana liquidity",
    ],
    cons: [
      "Solana-only — no multichain coverage",
      "Execution quality depends on underlying venues",
    ],
    dataConfidence: "medium",
  },
  {
    name: "dYdX",
    slug: "dydx",
    type: "Perp DEX",
    launched: 2017,
    chains: ["dYdX Chain"],
    primaryChain: "dYdX Chain (Cosmos app-chain)",
    feeModel:
      "Perp maker/taker with volume tiers — makers can reach roughly 0%, takers pay a small bps fee that scales down with volume.",
    spot: false,
    perps: true,
    tvl: "~$137M",
    token: "DYDX",
    referral:
      "v4 distributes effectively all trading fees to DYDX stakers. A front-end referral program has operated; current terms need verification.",
    hasReferralProgram: true,
    rating: 4.0,
    securityNotes:
      "No major smart-contract exploit of the v4 app-chain or the earlier StarkEx-based v3. Standard validator/consensus and oracle risks apply to the app-chain model.",
    affiliateUrl: "https://degen0x.com/go/dydx",
    bestFor: "Decentralized perps on a dedicated order-book app-chain",
    pros: [
      "Mature, purpose-built perps order book",
      "Effectively all trading fees flow to DYDX stakers",
      "Long operating history (since 2017)",
    ],
    cons: [
      "Volume and TVL have fallen sharply versus Hyperliquid",
      "Perpetuals only — no spot trading",
    ],
    dataConfidence: "medium",
    verifyNotes:
      "Confirm current v4 fee tiers and the referral program's terms.",
  },
  {
    name: "GMX",
    slug: "gmx",
    type: "Perp DEX",
    launched: 2021,
    chains: ["Arbitrum", "Avalanche", "Solana"],
    primaryChain: "Arbitrum",
    feeModel:
      "Pool-as-counterparty model — perp open/close fees ~0.1%, plus swap, borrow, and dynamic price-impact fees. A share of fees goes to GMX stakers.",
    spot: true,
    perps: true,
    tvl: null,
    tvlNote: "Current TVL not verified — pull live from DeFiLlama before publishing.",
    token: "GMX",
    referral:
      "Yes — a long-standing on-chain referral program: referees get a fee discount and referrers earn a tiered rebate share of fees.",
    hasReferralProgram: true,
    rating: 3.8,
    securityNotes:
      "Exploited twice: a ~$560K average-price manipulation on Avalanche in 2022, and a ~$42M reentrancy exploit of GMX v1 in July 2025 (most funds were returned for a bounty). v2 is the current product.",
    affiliateUrl: "https://degen0x.com/go/gmx",
    bestFor: "On-chain perps with a transparent pool-as-counterparty model",
    pros: [
      "Genuine on-chain referral/rebate program",
      "Transparent oracle-priced, pool-backed model",
      "Established presence on Arbitrum",
    ],
    cons: [
      "GMX v1 suffered a ~$42M exploit in July 2025",
      "Pool-as-counterparty model can mean wider effective costs",
    ],
    dataConfidence: "needs-verification",
    verifyNotes:
      "Pull current TVL from DeFiLlama and confirm v2 fee parameters.",
  },
  {
    name: "Curve Finance",
    slug: "curve",
    type: "AMM",
    launched: 2020,
    chains: [
      "Ethereum",
      "Arbitrum",
      "Optimism",
      "Polygon",
      "Base",
      "Avalanche",
      "Gnosis",
    ],
    primaryChain: "Ethereum",
    feeModel:
      "Low-slippage AMM — stableswap LP fees typically 0.01%–0.04% (customizable per pool); roughly half the swap fee goes to veCRV holders.",
    spot: true,
    perps: false,
    tvl: null,
    tvlNote: "Current TVL not verified — refresh from DeFiLlama before publishing.",
    token: "CRV",
    referral:
      "No affiliate program. Admin fees (~50% of swap fees) are distributed to veCRV lockers under a vote-escrow model.",
    hasReferralProgram: false,
    rating: 4.2,
    securityNotes:
      "Exploited in July 2023 via a Vyper compiler reentrancy bug (~$62M; ~73% of funds returned and a DAO compensation plan approved). The core stableswap design is otherwise well-proven.",
    affiliateUrl: "https://degen0x.com/go/curve",
    bestFor: "Low-slippage stablecoin and pegged-asset swaps",
    pros: [
      "Best-in-class for stablecoin and pegged-asset swaps",
      "Very low fees on stableswap pools",
      "Deep, mature liquidity and the crvUSD ecosystem",
    ],
    cons: [
      "Suffered a ~$62M Vyper exploit in 2023",
      "Vote-escrow mechanics are complex for newcomers",
    ],
    dataConfidence: "needs-verification",
    verifyNotes: "Refresh TVL from DeFiLlama.",
  },
  {
    name: "Aerodrome",
    slug: "aerodrome",
    type: "AMM",
    launched: 2023,
    chains: ["Base"],
    primaryChain: "Base",
    feeModel:
      "ve(3,3) AMM — stable pools ~0.05%, volatile pools ~0.30%, plus Slipstream concentrated-liquidity tiers. 100% of trading fees go to veAERO holders.",
    spot: true,
    perps: false,
    tvl: "~$1.3B",
    token: "AERO",
    referral:
      "No affiliate program. 100% of trading fees flow to veAERO lockers, who vote on liquidity incentives.",
    hasReferralProgram: false,
    rating: 4.2,
    securityNotes:
      "No major protocol-level exploit reported. As a Velodrome/Solidly-lineage fork on audited contracts, its risk profile is standard AMM plus malicious-token risk.",
    affiliateUrl: "https://degen0x.com/go/aerodrome",
    bestFor: "The central liquidity and trading hub on Base",
    pros: [
      "Holds the majority of DEX liquidity on Base",
      "100% of fees returned to veAERO lockers",
      "Strong incentive flywheel for LPs",
    ],
    cons: [
      "Currently concentrated on a single chain (Base)",
      "veAERO locks have no early exit",
    ],
    dataConfidence: "medium",
    verifyNotes:
      "A 2026 merger with Velodrome and cross-chain expansion is planned — confirm status before publishing.",
  },
  {
    name: "Raydium",
    slug: "raydium",
    type: "AMM",
    launched: 2021,
    chains: ["Solana"],
    primaryChain: "Solana",
    feeModel:
      "AMM LP fees — standard pools ~0.25%; CLMM/CPMM pools support tiers from 0.01% to 1%. About 12% of fees fund RAY buybacks.",
    spot: true,
    perps: false,
    tvl: "~$1.4B",
    token: "RAY",
    referral:
      "No affiliate program. LPs earn the trading-fee share; RAY buybacks return value to holders.",
    hasReferralProgram: false,
    rating: 4.0,
    securityNotes:
      "Exploited in December 2022 (~$2M+) via a compromised pool-owner admin key — a key-management incident rather than a contract logic bug.",
    affiliateUrl: "https://degen0x.com/go/raydium",
    bestFor: "Spot trading and LPing on Solana, especially new-token liquidity",
    pros: [
      "Core Solana AMM and a key venue Jupiter routes through",
      "Strong for new-token and memecoin liquidity",
      "Multiple pool types incl. concentrated liquidity",
    ],
    cons: [
      "Solana-only",
      "2022 admin-key exploit in its history",
    ],
    dataConfidence: "medium",
  },
  {
    name: "1inch",
    slug: "1inch",
    type: "Aggregator",
    launched: 2019,
    chains: [
      "Ethereum",
      "BNB Chain",
      "Arbitrum",
      "Optimism",
      "Base",
      "Polygon",
      "Avalanche",
      "zkSync",
    ],
    primaryChain: "Ethereum (multichain)",
    feeModel:
      "Aggregator — no protocol swap fee on classic routing; optimizes best execution across 400+ sources. Fusion mode uses competing resolvers with MEV protection.",
    spot: true,
    perps: false,
    tvl: null,
    tvlNote:
      "TVL is not a meaningful metric for an aggregator — 1inch routes through other DEXes' liquidity. Volume and routing share are the right measures.",
    token: "1INCH",
    referral:
      "No CEX-style affiliate program. Apps integrating the 1inch swap API can set an integrator referral fee on routed swaps.",
    hasReferralProgram: false,
    rating: 4.4,
    securityNotes:
      "No major exploit of the core aggregation/routing contracts; the 1inch router has a solid track record.",
    affiliateUrl: "https://degen0x.com/go/1inch",
    bestFor: "Best-price multichain token swaps with MEV protection",
    pros: [
      "Best-execution routing across 400+ liquidity sources",
      "Broad multichain coverage",
      "Fusion mode adds MEV protection",
    ],
    cons: [
      "Spot only — no perpetuals",
      "Execution quality depends on underlying liquidity",
    ],
    dataConfidence: "medium",
  },
];

/** All DEXes in the dataset. */
export function getAllDexes(): Dex[] {
  return dexes;
}

/** Look up a single DEX by slug. */
export function getDexBySlug(slug: string): Dex | undefined {
  return dexes.find((d) => d.slug === slug);
}

/** DEXes with a genuine referral/rebate program (real monetization upside). */
export function getDexesWithReferralProgram(): Dex[] {
  return dexes.filter((d) => d.hasReferralProgram);
}

/** DEXes whose figures still need verification before launch. */
export function getDexesNeedingVerification(): Dex[] {
  return dexes.filter((d) => d.dataConfidence === "needs-verification");
}

export type DexSortKey = "rating" | "launched" | "name";

/** Sort a copy of the DEX list by a key. */
export function sortDexes(
  key: DexSortKey,
  direction: "asc" | "desc" = "desc",
  list: Dex[] = dexes
): Dex[] {
  const value = (d: Dex): number | string => {
    switch (key) {
      case "rating":
        return d.rating;
      case "launched":
        return d.launched;
      case "name":
        return d.name.toLowerCase();
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

/** Filter the DEX list with a predicate. */
export function filterDexes(predicate: (dex: Dex) => boolean): Dex[] {
  return dexes.filter(predicate);
}
