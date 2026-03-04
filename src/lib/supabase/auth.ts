import { createClient } from "./server";
import { Profile, Membership } from "./types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return false;
  return data?.role === "admin";
}

export async function getActiveMembership(
  userId: string
): Promise<Membership | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Membership | null;
}

export async function createMembership(
  userId: string,
  membershipType: "day_pass" | "30_day",
  amountPaid: number
) {
  const supabase = await createClient();

  const now = new Date();
  const expiresAt =
    membershipType === "day_pass"
      ? new Date(now.getTime() + 10 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from("memberships")
    .insert([
      {
        user_id: userId,
        membership_type: membershipType,
        amount_paid: amountPaid,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Membership;
}

export async function updateMembershipStatus(
  membershipId: string,
  isActive: boolean
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", membershipId)
    .select()
    .single();

  if (error) throw error;
  return data as Membership;
}

export async function createTransaction(
  userId: string,
  membershipId: string,
  amount: number,
  stripePaymentId?: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id: userId,
        membership_id: membershipId,
        stripe_payment_id: stripePaymentId || null,
        amount,
        currency: "gbp",
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransactionStatus(
  transactionId: string,
  status: "succeeded" | "failed",
  emailSent: boolean = false,
  smsSent: boolean = false
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({
      status,
      email_sent: emailSent,
      sms_sent: smsSent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
