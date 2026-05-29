import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Crypto Tools & Data`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free crypto tools and original data — exchange and DEX fee comparisons, calculators, and maintained datasets. Honest, methodology-first, no signup.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            borderBottom: "1px solid var(--glass-border)",
            padding: "14px 0",
            position: "sticky",
            top: 0,
            background: "var(--color-bg)",
            zIndex: 10,
          }}
        >
          <nav
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 1rem",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Link href="/" style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--color-text)", textDecoration: "none" }}>
              {SITE_NAME}
            </Link>
            <Link href="/exchange-fee-index" style={{ fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none" }}>
              Fee Index
            </Link>
            <Link href="/tools/fee-comparison" style={{ fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none" }}>
              Tools
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--glass-border)",
            marginTop: 48,
            padding: "24px 1rem",
            color: "var(--color-text-secondary)",
            fontSize: 13,
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ margin: 0 }}>
              {SITE_NAME} publishes honest, dated comparison data. Some links are affiliate links; rankings are on merit, not commission.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
