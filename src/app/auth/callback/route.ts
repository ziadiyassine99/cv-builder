import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_REDIRECTS = ["/app", "/app/"];

function getSafeRedirect(next: string | null): string {
  if (!next) return "/app";
  if (!next.startsWith("/") || next.startsWith("//")) return "/app";
  if (next.includes("..")) return "/app";

  try {
    const url = new URL(next, "http://localhost");
    if (url.pathname.startsWith("/app")) return url.pathname;
  } catch {
    return "/app";
  }

  if (ALLOWED_REDIRECTS.includes(next)) return next;
  return "/app";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const safeRedirect = getSafeRedirect(next);
      return NextResponse.redirect(`${origin}${safeRedirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
