import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { exchanges, EXCHANGE_DATA_AS_OF } from "@/data/exchanges";
import {
  generateItemListSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  serializeSchema,
} from "@/lib/structured-data";

const PAGE_URL = `${SITE_URL}/best-crypto-exchanges`;
const PUBLISHED = "2026-05-29";

function pct(n: number): string {
  return `${n.toFixed(n < 0.1 ? 3 : 2)}%`;
}

export const metadata: Metadata = {
  title: "Best Crypto Exchanges (2026): Honestly Ranked & Compared",
  description:
    "The best crypto exchanges in 2026, ranked on fees, security, and access — with base-tier maker/taker rates, US availability, and an honest methodology. By Raul Amoros.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Best Crypto Exchanges (2026)",
    description: "Honestly ranked crypto exchanges — fees, security, US availability, and full reviews.",
    url: PAGE_URL,
    type: "article",
    authors: ["Raul Amoros"],
  },
};

export default function BestExchangesPage() {
  const ranked = [...exchanges].sort((a, b) => b.rating - a.rating);

  const schema = serializeSchema([
    generateArticleSchema({
      title: "Best Crypto Exchanges (2026)",
      description: "Honestly ranked crypto exchanges on fees, security, and access.",
      url: PAGE_URL,
      datePublished: PUBLISHED,
      dateModified: EXCHANGE_DATA_AS_OF,
      author: "Raul Amoros",
    }),
    generateItemListSchema({
      name: "Best Crypto Exchanges 2026",
      description: "Crypto exchanges ranked by fees, security, and access.",
      items: ranked.map((e) => ({ name: e.name, url: `${SITE_URL}/exchanges/${e.slug}` })),
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Best Crypto Exchanges", url: PAGE_URL },
    ]),
  ]);

  const card: React.CSSProperties = {
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: 12,
    padding: "16px 18px",
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Best Crypto Exchanges" }]} />

      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0 0 12px" }}>Best Crypto Exchanges (2026)</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", fontSize: 14, color: "var(--color-text-secondary)" }}>
          <span>By <Link href="/authors/raul-amoros" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Raul Amoros</Link></span>
          <span aria-hidden>·</span>
          <span>Updated {PUBLISHED}</span>
          <span aria-hidden>·</span>
          <span>Fees as of {EXCHANGE_DATA_AS_OF}</span>
        </div>
      </header>

      <div style={{ ...card, borderLeft: "3px solid var(--color-primary)", marginBottom: 24 }}>
        <strong>TL;DR.</strong>{" "}
        <span style={{ lineHeight: 1.7 }}>
          We rank {exchanges.length} major exchanges on fees, security, and access. {ranked[0].name} tops our
          list at {ranked[0].rating.toFixed(1)}/5{ranked[1] ? `, followed by ${ranked[1].name} and ${ranked[2].name}` : ""}.
          The cheapest base-tier taker fee here is {pct(Math.min(...exchanges.map((e) => e.spotFee.taker)))}; the most
          expensive is {pct(Math.max(...exchanges.map((e) => e.spotFee.taker)))}. There is no single &ldquo;best&rdquo; —
          the right pick depends on whether you prioritize low fees, US access, or product range.
        </span>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {ranked.map((e, i) => (
          <div key={e.slug} style={{ ...card, display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-secondary)", minWidth: 36 }}>#{i + 1}</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <Link href={`/exchanges/${e.slug}`} style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-text)", textDecoration: "none" }}>
                  {e.name}
                </Link>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{e.rating.toFixed(1)}/5</span>
              </div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "4px 0 8px" }}>Best for {e.bestFor.toLowerCase()}</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--color-text-secondary)" }}>
                <span>Taker {pct(e.spotFee.taker)}</span>
                <span>Maker {pct(e.spotFee.maker)}</span>
                <span>US: {e.usAvailability === "yes" ? "Yes" : e.usAvailability === "restricted" ? "Restricted" : "No"}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
              <a
                href={`/go/${e.slug}?utm_source=best-exchanges&utm_medium=pillar&utm_campaign=${e.slug}`}
                rel="sponsored nofollow"
                style={{ background: "var(--color-primary)", color: "#fff", fontWeight: 700, padding: "8px 16px", borderRadius: 8, textDecoration: "none", textAlign: "center", fontSize: 14 }}
              >
                Visit
              </a>
              <Link href={`/exchanges/${e.slug}`} style={{ color: "var(--color-primary)", fontSize: 13, textAlign: "center", textDecoration: "none" }}>
                Read review →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "36px 0 12px" }}>How we rank</h2>
      <p style={{ lineHeight: 1.7, color: "var(--color-text)" }}>
        Rankings weigh base-tier trading fees, security track record (including past incidents and whether the
        exchange publishes proof-of-reserves), regulatory standing, market depth, and breadth of supported assets.
        Fees shown are base-tier (VIP 0) maker/taker rates before token or volume discounts, compiled as of{" "}
        {EXCHANGE_DATA_AS_OF}. For a sortable side-by-side of every venue including DEXes, see the{" "}
        <Link href="/exchange-fee-index" style={{ color: "var(--color-primary)" }}>Exchange &amp; DEX Fee Index</Link>.
      </p>

      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 24, lineHeight: 1.6 }}>
        {SITE_NAME} earns affiliate commissions from some exchanges listed here. Rankings and fee figures reflect
        published rates and our editorial assessment — they are not influenced by commission.
      </p>
    </div>
  );
}
