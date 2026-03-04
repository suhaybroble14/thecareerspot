"use server";

import { createClient } from "@/lib/supabase/server";
import type { Membership, MembershipApplication } from "@/lib/supabase/types";

export async function getMyMembership(): Promise<Membership | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fetch membership error:", error);
  }

  return (data as Membership) || null;
}

export async function getMyApplicationStatus(): Promise<MembershipApplication | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fetch application error:", error);
  }

  return (data as MembershipApplication) || null;
}
