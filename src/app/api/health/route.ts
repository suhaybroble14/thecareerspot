import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const checks: Record<string, { ok: boolean; message?: string }> = {};

  // Check required env vars
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ];

  const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
  checks.env = {
    ok: missingEnvVars.length === 0,
    message:
      missingEnvVars.length > 0
        ? `Missing: ${missingEnvVars.join(", ")}`
        : undefined,
  };

  // Check optional env vars
  checks.email = {
    ok: !!process.env.RESEND_API_KEY,
    message: !process.env.RESEND_API_KEY ? "RESEND_API_KEY not set" : undefined,
  };

  // Check Supabase connection
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    checks.supabase = {
      ok: !error,
      message: error?.message,
    };
  } catch (err) {
    checks.supabase = {
      ok: false,
      message: err instanceof Error ? err.message : "Connection failed",
    };
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
