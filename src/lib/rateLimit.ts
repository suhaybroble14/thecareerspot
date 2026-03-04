import { createAdminClient } from "./supabase/admin";

/**
 * Simple rate limiter using Supabase.
 * key: unique identifier (e.g. "app_submit:email@example.com")
 * maxAttempts: max allowed within the window
 * windowMinutes: time window in minutes
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createAdminClient();
  const windowStart = new Date(
    Date.now() - windowMinutes * 60 * 1000
  ).toISOString();

  // Count recent attempts
  const { data: existing } = await supabase
    .from("rate_limits")
    .select("attempts")
    .eq("key", key)
    .gte("window_start", windowStart)
    .single();

  if (existing) {
    if (existing.attempts >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }

    // Increment
    await supabase
      .from("rate_limits")
      .update({ attempts: existing.attempts + 1 })
      .eq("key", key)
      .gte("window_start", windowStart);

    return { allowed: true, remaining: maxAttempts - existing.attempts - 1 };
  }

  // Create new window
  await supabase.from("rate_limits").insert({
    key,
    attempts: 1,
    window_start: new Date().toISOString(),
  });

  return { allowed: true, remaining: maxAttempts - 1 };
}
