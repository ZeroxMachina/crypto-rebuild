import { NextRequest, NextResponse } from "next/server";
import { getPartner } from "@/lib/affiliate";

/**
 * Affiliate redirect: /go/[partner]
 * - Resolves the partner, attaches UTM params, logs the click, 302-redirects.
 * - Unknown partners redirect home.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ partner: string }> }
) {
  const { partner: slug } = await params;
  const partner = getPartner(slug);

  if (!partner) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const sp = request.nextUrl.searchParams;
  const utm = {
    utm_source: sp.get("utm_source") ?? "site",
    utm_medium: sp.get("utm_medium") ?? "affiliate",
    utm_campaign: sp.get("utm_campaign") ?? partner.category,
    utm_content: sp.get("utm_content") ?? slug,
  };

  console.log(
    `[AFFILIATE] partner=${slug} ${Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(" ")} t=${new Date().toISOString()}`
  );

  const dest = new URL(partner.fallbackUrl);
  Object.entries(utm).forEach(([k, v]) => dest.searchParams.set(k, v));
  dest.searchParams.set("ref", "cryptorebuild");

  const res = NextResponse.redirect(dest.toString(), { status: 302 });
  res.cookies.set(`aff_${slug}`, "1", { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
  return res;
}
