# crypto-rebuild

Clean rebuild of the crypto tools & data platform — a focused set of best-in-class tools and original datasets, monetized via honest, disclosed affiliate links. No legacy content, no scaled-content baggage.

Working repo name `crypto-rebuild` is temporary; rename once the brand domain lands.

## Stack
- Next.js 16 (App Router) + TypeScript (strict)
- Inline styles + CSS variables (no Tailwind dependency)
- Static datasets with "as of" dates and data-confidence flags

## Structure
```
src/
  app/                 routes
    exchange-fee-index/ original Fee Index dataset page
    tools/fee-comparison/ Fee Comparison tool (Tool 1)
    authors/            author identity pages
    go/[partner]/       affiliate redirect + click tracking
  components/           UI (Breadcrumb, FeeComparisonTool)
  data/                 verified datasets (exchanges, dexes)
  lib/                  constants, structured-data, affiliate
public/llms.txt         GEO citation map
```

## Config
Set `NEXT_PUBLIC_SITE_URL` to the deployed origin (used for canonical URLs + JSON-LD). Defaults to localhost in dev.

## Develop
```bash
npm install
npm run dev
```
