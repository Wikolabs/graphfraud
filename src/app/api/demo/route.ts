import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In docker-compose: BACKEND_URL=http://graphfraud-backend:8000
// In local dev (next dev outside compose): falls back to localhost
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: Request) {
  let body: { accountA?: string; accountB?: string; link?: string; lang?: "fr" | "en" } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const accountA = typeof body.accountA === "string" ? body.accountA.trim().slice(0, 60) : "";
  const accountB = typeof body.accountB === "string" ? body.accountB.trim().slice(0, 60) : "";
  const link = typeof body.link === "string" ? body.link.trim().slice(0, 400) : "";
  const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

  if (!accountA || !accountB) {
    return NextResponse.json(
      { error: lang === "fr" ? "Entrez les deux identifiants de comptes." : "Enter both account IDs." },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_a: accountA, account_b: accountB, suspect_link: link, lang }),
      cache: "no-store",
    });
    const j = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: j.detail || "backend_error" }, { status: r.status });
    }
    return NextResponse.json({
      output: j.output,
      model: j.model,
      generatedAt: j.generated_at,
      staticMode: Boolean(j.static_mode),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ error: `backend_unreachable: ${msg}` }, { status: 502 });
  }
}
