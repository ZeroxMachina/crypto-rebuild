import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  exchanges,
  getExchangeBySlug,
  EXCHANGE_DATA_AS_OF,
  type Exchange,
} from "@/data/exchanges";
import {
  generateReviewSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  serializeSchema,
} from "@/lib/structured-data";

const PUBLISHED = "2026-05-29";

// ── helpers ──────────────────────────────────────────────────────────────────
function pct(n: number): string {
  return `${n.toFixed(n < 0.1 ? 3 : 2)}%`;
}

const AVG_TAKER =
  exchanges.reduce((s, e) => s + e.spotFee.taker, 0) / exchanges.length;

const US_SENTENCE: Record<Exchange["usAvailability"], string> = {
  yes: "It is available to US residents",
  restricted: "It is available to US residents only with restrictions (limited products or state-by-state)",
  no: "It is not available to US residents",
};

const KYC_SENTENCE: Record<Exchange["kyc"], string> = {
  required: "identity verification (KYC) is required to trade",
  tiered: "basic use is possible with light verification, with full KYC needed for higher limits",
  optional: "KYC is optional for basic use",
};

function feePositioning(taker: number): string {
  if (taker < AVG_TAKER * 0.6) return "well below the average across the exchanges we track";
  if (taker < AVG_TAKER) return "below the average across the exchanges we track";
  if (taker < AVG_TAKER * 1.4) return "around the average across the exchanges we track";
  return "above the average across the exchanges we track";
}

function buildVerdict(e: Exchange): string {
  const descriptors = [
    e.regulated ? "regulated" : null,
    e.publicCompany ? "publicly listed" : null,
  ].filter(Boolean) as string[];
  const descr = descriptors.length ? descriptors.join(", ") + " " : "";
  const hasPlaceHQ = !/\bno\b|n\/a|global hq/i.test(e.headquarters);
  const hq = hasPlaceHQ ? ` and headquartered in ${e.headquarters}` : "";
  return (
    `${e.name}, founded in ${e.founded}${hq}, is a ${descr}crypto exchange that earns ${e.rating.toFixed(1)} out of 5 in our assessment. ` +
    `It is best suited for ${e.bestFor.toLowerCase()}. ` +
    `Its base-tier spot taker fee of ${pct(e.spotFee.taker)} sits ${feePositioning(e.spotFee.taker)} (${pct(AVG_TAKER)}). ` +
    `${US_SENTENCE[e.usAvailability]}, and ${KYC_SENTENCE[e.kyc]}.`
  );
}

function buildFaqs(e: Exchange): { q: string; a: string }[] {
  const usMap: Record<Exchange["usAvailability"], string> = {
    yes: `Yes. ${e.name} is available to US residents, though specific products and supported states can vary — check its site for your state.`,
    restricted: `Partly. ${e.name} is available to US users only with restrictions: some products are limited or unavailable, and access can vary by state. Confirm current availability on its site.`,
    no: `No. ${e.name} does not serve US residents. US users should choose a US-available exchange instead.`,
  };
  return [
    {
      q: `What are ${e.name}'s trading fees?`,
      a: `${e.name}'s base-tier (VIP 0) spot fees are ${pct(e.spotFee.maker)} maker and ${pct(e.spotFee.taker)} taker, before any exchange-token or volume discounts.${e.futuresFee ? ` Base futures fees are ${pct(e.futuresFee.maker)} maker / ${pct(e.futuresFee.taker)} taker.` : ""} For context, the average base-tier taker fee across the exchanges we track is ${pct(AVG_TAKER)}.`,
    },
    { q: `Is ${e.name} available in the US?`, a: usMap[e.usAvailability] },
    {
      q: `Is ${e.name} safe?`,
      a: `${e.securityNotes} ${e.proofOfReserves ? "It publishes proof-of-reserves attestations." : "It does not currently publish proof-of-reserves attestations."} As always, holding large balances on any exchange carries custodial risk — consider self-custody for long-term holdings.`,
    },
  ];
}

const CONFIDENCE_NOTE: Record<Exchange["dataConfidence"], string> = {
  high: "Figures on this page were reconciled against the exchange's official fee schedule.",
  medium: "Some figures had minor discrepancies across sources; treat fees as indicative and confirm before large trades.",
  "needs-verification": "Some figures on this page still need verification against the official fee page — confirm before relying on them.",
};

// ── static generation ────────────────────────────────────────────────────────
export function generateStaticParams() {
  return exchanges.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getExchangeBySlug(slug);
  if (!e) return { title: "Exchange not found" };
  const url = `${SITE_URL}/exchanges/${e.slug}`;
  return {
    title: `${e.name} Review (2026): Fees, Safety & Verdict`,
    description: `An honest ${e.name} review — base-tier fees (${pct(e.spotFee.maker)}/${pct(e.spotFee.taker)}), US availability, security history, pros and cons, and our ${e.rating.toFixed(1)}/5 verdict.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${e.name} Review (2026)`,
      description: `Fees, safety, pros and cons, and our ${e.rating.toFixed(1)}/5 verdict on ${e.name}.`,
      url,
      type: "article",
      authors: ["Raul Amoros"],
    },
  };
}

// ── page ─────────────────────────────────────────────────────────────────────
export default async function ExchangeReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getExchangeBySlug(slug);
  if (!e) notFound();

  const url = `${SITE_URL}/exchanges/${e.slug}`;
  const verdict = buildVerdict(e);
  const faqs = buildFaqs(e);
  const goHref = `/go/${e.slug}?utm_source=exchange-review&utm_medium=review&utm_campaign=${e.slug}`;

  const schema = serializeSchema([
    generateReviewSchema({
      itemName: e.name,
      itemType: "FinancialService",
      url,
      rating: e.rating,
      author: "Raul Amoros",
      datePublished: PUBLISHED,
      reviewBody: verdict,
    }),
    generateFAQSchema(faqs),
    generateBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Exchanges", url: `${SITE_URL}/best-crypto-exchanges` },
      { name: e.name, url },
    ]),
  ]);

  const card: React.CSSProperties = {
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    borderRadius: 12,
    padding: "16px 18px",
  };
  const h2: React.CSSProperties = { fontSize: "1.35rem", fontWeight: 800, margin: "36px 0 14px" };

  const facts: [string, string][] = [
    ["Founded", String(e.founded)],
    ["Headquarters", e.headquarters],
    ["Spot fees (maker/taker)", `${pct(e.spotFee.maker)} / ${pct(e.spotFee.taker)}`],
    ["Futures fees", e.futuresFee ? `${pct(e.futuresFee.maker)} / ${pct(e.futuresFee.taker)}` : "Not offered / N/A"],
    ["Coins listed", `~${e.coins.toLocaleString()}`],
    ["US availability", e.usAvailability === "yes" ? "Yes" : e.usAvailability === "restricted" ? "Restricted" : "No"],
    ["KYC", e.kyc === "required" ? "Required" : e.kyc === "tiered" ? "Tiered" : "Optional"],
    ["Proof of reserves", e.proofOfReserves ? "Yes" : "No"],
    ["Staking", e.stakingAvailable ? "Yes" : "No"],
    ["Regulated", e.regulated ? "Yes" : "Limited / varies"],
  ];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Exchanges", href: "/best-crypto-exchanges" },
          { label: e.name },
        ]}
      />

      <header style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "2.1rem", fontWeight: 800, margin: 0 }}>{e.name} Review</h1>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)" }}>
            {e.rating.toFixed(1)} / 5
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 8 }}>
          <span>By <Link href="/authors/raul-amoros" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Raul Amoros</Link></span>
          <span aria-hidden>·</span>
          <span>Updated {PUBLISHED}</span>
          <span aria-hidden>·</span>
          <span>Fees as of {EXCHANGE_DATA_AS_OF}</span>
        </div>
      </header>

      {/* Verdict — self-contained answer block */}
      <div style={{ ...card, borderLeft: "3px solid var(--color-primary)", marginBottom: 20 }}>
        <strong>Verdict.</strong> <span style={{ lineHeight: 1.7 }}>{verdict}</span>
      </div>

      {/* CTA */}
      <div style={{ ...card, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
          Affiliate program: {e.affiliateProgram}
        </div>
        <a
          href={goHref}
          rel="sponsored nofollow"
          style={{ background: "var(--color-primary)", color: "#fff", fontWeight: 700, padding: "10px 20px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Visit {e.name} →
        </a>
      </div>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 8px" }}>
        Disclosure: this is an affiliate link. It doesn&rsquo;t change our rating or the fees shown.
      </p>

      {/* Quick facts */}
      <h2 style={h2}>Quick facts</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        {facts.map(([k, v]) => (
          <div key={k} style={card}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 0.4 }}>{k}</div>
            <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Pros / Cons */}
      <h2 style={h2}>Pros &amp; cons</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div style={{ ...card, borderColor: "rgba(34,197,94,0.3)" }}>
          <div style={{ fontWeight: 800, color: "var(--green)", marginBottom: 8 }}>Pros</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            {e.pros.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div style={{ ...card, borderColor: "rgba(239,68,68,0.3)" }}>
          <div style={{ fontWeight: 800, color: "var(--red)", marginBottom: 8 }}>Cons</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            {e.cons.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>

      {/* Security */}
      <h2 style={h2}>Security &amp; trust</h2>
      <p style={{ lineHeight: 1.7, color: "var(--color-text)" }}>{e.securityNotes}</p>
      <p style={{ lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
        {e.proofOfReserves
          ? `${e.name} publishes proof-of-reserves attestations, which let users independently check that customer assets are backed.`
          : `${e.name} does not currently publish proof-of-reserves attestations.`}{" "}
        Whichever exchange you use, keep only what you actively trade on it and self-custody long-term holdings.
      </p>

      {/* FAQ */}
      <h2 style={h2}>Frequently asked questions</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {faqs.map((f) => (
          <div key={f.q} style={card}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 6px" }}>{f.q}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)", margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>

      {/* Related */}
      <h2 style={h2}>Compare further</h2>
      <p style={{ lineHeight: 1.7 }}>
        See how {e.name}&rsquo;s fees stack up against every major venue in the{" "}
        <Link href="/exchange-fee-index" style={{ color: "var(--color-primary)" }}>Exchange &amp; DEX Fee Index</Link>, or browse all{" "}
        <Link href="/best-crypto-exchanges" style={{ color: "var(--color-primary)" }}>reviewed exchanges</Link>.
      </p>

      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 24, lineHeight: 1.6 }}>
        {CONFIDENCE_NOTE[e.dataConfidence]} Ratings are {SITE_NAME} editorial assessments and are not influenced by affiliate relationships.
      </p>
    </div>
  );
}
