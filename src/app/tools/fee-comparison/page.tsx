import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FeeComparisonTool from "@/components/FeeComparisonTool";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  generateToolPageSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  serializeSchema,
} from "@/lib/structured-data";

const PAGE_URL = `${SITE_URL}/tools/fee-comparison`;

export const metadata: Metadata = {
  title: "Crypto Exchange & DEX Fee Comparison Tool",
  description:
    "Compare base-tier trading fees across 12 major crypto exchanges and 10 DEXes side by side — maker/taker rates, futures fees, US availability, and data-confidence flags.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Crypto Exchange & DEX Fee Comparison",
    description: "Side-by-side trading fees for 12 exchanges and 10 DEXes — honest, methodology-first, with an 'as of' date.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "Which crypto exchange has the lowest trading fees?",
    a: "Among major exchanges, MEXC and Binance carry some of the lowest base-tier spot fees (MEXC advertises 0% maker / 0.05% taker; Binance is 0.10% / 0.10%). US-available options like Kraken (0.25% / 0.40%) sit higher, and Coinbase and Gemini's standard tiers are the most expensive at 0.60% / 1.20%. All figures are base-tier before token or volume discounts.",
  },
  {
    q: "Are maker and taker fees different?",
    a: "Yes. A maker order adds liquidity to the order book (a limit order that doesn't fill immediately) and usually pays a lower fee. A taker order removes liquidity (a market order, or a limit order that fills instantly) and typically pays more. Many exchanges also lower both as your 30-day volume rises.",
  },
  {
    q: "Do DEXes have lower fees than centralized exchanges?",
    a: "Not directly comparable. DEXes charge LP fee tiers (often 0.01%–0.30%), perp maker/taker fees, or aggregator routing fees, plus network gas. On low-fee chains a DEX swap can be cheaper than a CEX taker fee; on Ethereum mainnet, gas can make small swaps more expensive. The fee model is shown per protocol.",
  },
  {
    q: "Why are some figures marked 'unverified' or 'partial'?",
    a: "We flag data confidence honestly. 'Verified' entries were reconciled against the exchange's official fee page; 'partial' or 'unverified' entries had conflicting figures across sources and should be confirmed before relying on them for large trades.",
  },
];

export default function FeeComparisonPage() {
  const schema = serializeSchema([
    generateToolPageSchema({
      name: "Crypto Exchange & DEX Fee Comparison Tool",
      description: "Interactive side-by-side comparison of base-tier trading fees across major crypto exchanges and DEXes.",
      url: PAGE_URL,
      applicationCategory: "FinanceApplication",
    }),
    generateFAQSchema(FAQS),
    generateBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Tools", url: `${SITE_URL}/tools` },
      { name: "Fee Comparison", url: PAGE_URL },
    ]),
  ]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Fee Comparison" }]} />

      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 10px" }}>Crypto Exchange &amp; DEX Fee Comparison</h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--color-text-secondary)", margin: 0 }}>
          Base-tier maker/taker fees for 12 major exchanges and 10 DEXes, side by side. Sort by any column,
          switch between centralized and decentralized venues, and see exactly how confident we are in each
          figure. Fees shown are before token or volume discounts.
        </p>
      </header>

      <FeeComparisonTool />

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 16 }}>Frequently asked questions</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {FAQS.map((f) => (
            <div key={f.q} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "14px 18px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 6px" }}>{f.q}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)", margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 28 }}>
        {SITE_NAME} earns affiliate commissions from some venues listed here. Fee figures and rankings are not influenced by commission.
      </p>
    </div>
  );
}
