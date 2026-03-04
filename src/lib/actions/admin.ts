"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getTodayStats() {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  // Get today's check-ins
  const { count: checkInCount } = await supabase
    .from("check_ins")
    .select("*", { count: "exact", head: true })
    .gte("checked_in_at", `${today}T00:00:00`)
    .lt("checked_in_at", `${today}T23:59:59`);

  // Get today's confirmed bookings
  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("booking_date", today)
    .eq("status", "confirmed");

  // Get active monthly memberships
  const { count: monthlyCount } = await supabase
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("membership_type", "30_day")
    .gte("expires_at", new Date().toISOString());

  // Get pending applications
  const { count: pendingApps } = await supabase
    .from("membership_applications")
    .select("*", { count: "exact", head: true })
    .in("status", ["submitted", "under_review"]);

  // Capacity
  const totalCapacity = 14;
  const { data: override } = await supabase
    .from("capacity_overrides")
    .select("max_capacity")
    .eq("override_date", today)
    .single();

  const maxCapacity = override?.max_capacity ?? totalCapacity;
  const currentOccupancy = (checkInCount || 0);

  return {
    checkInsToday: checkInCount || 0,
    confirmedBookings: bookingCount || 0,
    activeMonthly: monthlyCount || 0,
    pendingApplications: pendingApps || 0,
    maxCapacity,
    currentOccupancy,
  };
}

export async function getRecentCheckIns(limit = 10) {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("check_ins")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .gte("checked_in_at", `${today}T00:00:00`)
    .order("checked_in_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Fetch check-ins error:", error);
    return [];
  }

  return data || [];
}

export async function getAllMembers() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch members error:", error);
    return [];
  }

  return data || [];
}

export async function getMemberDetail(userId: string) {
  const supabase = createAdminClient();

  const [profileRes, bookingsRes, membershipsRes, checkInsRes, notesRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("booking_date", { ascending: false })
        .limit(20),
      supabase
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", userId)
        .order("checked_in_at", { ascending: false })
        .limit(20),
      supabase
        .from("admin_notes")
        .select("*")
        .eq("target_type", "user")
        .eq("target_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  return {
    profile: profileRes.data,
    bookings: bookingsRes.data || [],
    memberships: membershipsRes.data || [],
    checkIns: checkInsRes.data || [],
    notes: notesRes.data || [],
  };
}

export async function getBookingsForDate(date: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .eq("booking_date", date)
    .in("status", ["confirmed", "checked_in"])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch bookings for date error:", error);
    return [];
  }

  return data || [];
}
