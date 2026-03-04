import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  // Supabase returned an OAuth error — go home, not back to login
  if (error) {
    console.error("[auth/callback] OAuth error:", error, searchParams.get("error_description"));
    return NextResponse.redirect(`${origin}/`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // Save first name + last name into profiles table so navbar shows real name
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const meta = user.user_metadata ?? {};
          const firstName = ((meta.first_name as string) ?? "").trim();
          const lastName = ((meta.last_name as string) ?? "").trim();
          const fullName = ((meta.full_name as string) ?? "").trim() ||
            `${firstName} ${lastName}`.trim();
          if (fullName) {
            await supabase.from("profiles").upsert(
              {
                id: user.id,
                email: user.email,
                full_name: fullName || null,
                first_name: firstName || null,
                last_name: lastName || null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );
          }
        }
      } catch {
        // Non-fatal — profile save failed but login still succeeds
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession failed:", exchangeError.message);
  }

  // Fallback — something went wrong, send home
  return NextResponse.redirect(`${origin}/`);
}
