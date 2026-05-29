import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import FeeComparisonTool from "@/components/FeeComparisonTool";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { exchanges, EXCHANGE_DATA_AS_OF } from "@/data/exchanges";
import { generateArticleSchema, generateBreadcrumbSchema, serializeSchema } from "@/lib/structured-data";

const PAGE_URL = `${SITE_URL}/exchange-fee-index`;
const PUBLISHED = "2026-05-29";

export const metadata: Metadata = {
  title: "Exchange & DEX Fee Index — Crypto Trading Fees Compared",
  description:
    "An original, maintained dataset of base-tier trading fees across 12 major crypto exchanges and 10 DEXes — with methodology, an 'as of' date, and honest data-confidence flags.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Exchange & DEX Fee Index",
    description: "Original maintained dataset: base-tier trading fees across 12 exchanges and 10 DEXes.",
    url: PAGE_URL,
    type: "article",
    authors: ["Raul Amoros"],
  },
};

function fmtPct(n: number): string {
  return `${n.toFixed(n < 0.1 ? 3 : 2)}%`;
}

export default function ExchangeFeeIndexPage() {
  const cheapestTaker = [...exchanges].sort((a, b) => a.spotFee.taker - b.spotFee.taker)[0];
  const usAvailable = exchanges.filter((e) => e.usAvailability !== "no");
  const cheapestUS = [...usAvailable].sort((a, b) => a.spotFee.taker - b.spotFee.taker)[0];
  const withFutures = exchanges.filter((e) => e.futuresFee);
  const lowestFutures = [...withFutures].sort((a, b) => a.futuresFee!.taker - b.futuresFee!.taker)[0];
  const topRated = [...exchanges].sort((a, b) => b.rating - a.rating)[0];
  const avgTaker = exchanges.reduce((s, e) => s + e.spotFee.taker, 0) / exchanges.length;

  const schema = serializeSchema([
    generateArticleSchema({
      title: "Exchange & DEX Fee Index",
      description: "An original, maintained dataset of base-tier trading fees across major crypto exchanges and DEXes.",
      url: PAGE_URL,
      datePublished: PUBLISHED,
      dateModified: EXCHANGE_DATA_AS_OF,
      author: "Raul Amoros",
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Exchange Fee Index", url: PAGE_URL },
    ]),
  ]);

  const card: React.CSSProperties = {
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: 12,
    padding: "16px 18px",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Exchange Fee Index" }]} />

      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "2.1rem", fontWeight: 800, margin: "0 0 12px" }}>The Exchange &amp; DEX Fee Index</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", fontSize: 14, color: "var(--color-text-secondary)" }}>
          <span>
            By <Link href="/authors/raul-amoros" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Raul Amoros</Link>
          </span>
          <span aria-hidden>·</span>
          <span>Published {PUBLISHED}</span>
          <span aria-hidden>·</span>
          <span>Data as of {EXCHANGE_DATA_AS_OF}</span>
        </div>
      </header>

      <div style={{ ...card, borderLeft: "3px solid var(--color-primary)", marginBottom: 28 }}>
        <strong>TL;DR.</strong>{" "}
        <span style={{ lineHeight: 1.7 }}>
          Across the {exchanges.length} major exchanges we track, base-tier spot taker fees range from{" "}
          {fmtPct(cheapestTaker.spotFee.taker)} ({cheapestTaker.name}) to {fmtPct(1.2)} (Coinbase and Gemini
          standard tiers), averaging {fmtPct(avgTaker)}. The cheapest taker fee available to US users is{" "}
          {cheapestUS.name} at {fmtPct(cheapestUS.spotFee.taker)}. For futures, {lowestFutures.name} posts the
          lowest base taker fee at {fmtPct(lowestFutures.futuresFee!.taker)}. All figures are base-tier (VIP 0),
          before exchange-token or volume discounts.
        </span>
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 14 }}>Key findings</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {[
            { label: "Cheapest spot taker", name: cheapestTaker.name, val: fmtPct(cheapestTaker.spotFee.taker) },
            { label: "Cheapest US-available", name: cheapestUS.name, val: `${fmtPct(cheapestUS.spotFee.taker)} taker` },
            { label: "Lowest futures taker", name: lowestFutures.name, val: fmtPct(lowestFutures.futuresFee!.taker) },
            { label: "Highest editorial rating", name: topRated.name, val: `${topRated.rating.toFixed(1)} / 5` },
          ].map((f) => (
            <div key={f.label} style={card}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{f.name}</div>
              <div style={{ color: "var(--color-primary)", fontWeight: 700 }}>{f.val}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 6 }}>The full dataset</h2>
        <p style={{ color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>
          Sort by any column and toggle between centralized exchanges and DEXes. Each entry carries a
          data-confidence flag — we mark plainly what we&rsquo;ve reconciled against official fee pages and what
          still needs verification.
        </p>
        <FeeComparisonTool />
      </section>

      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 24, lineHeight: 1.6 }}>
        Disclosure: {SITE_NAME} earns affiliate commissions from some venues listed here. Rankings and fee
        figures are not influenced by commission — they reflect published rates and our editorial assessment.
        We update this index as fee schedules change.
      </p>
    </div>
  );
}
