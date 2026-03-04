import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  // Verify admin
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { code } = await request.json();
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Try day pass booking first (QR code match)
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("qr_code", code)
    .single();

  if (booking) {
    // Validate day pass
    if (booking.status !== "confirmed") {
      logAudit(user.id, "check_in.failed", "booking", booking.id, {
        reason: "not_confirmed", code: code.slice(0, 8),
      }).catch(() => {});
      return NextResponse.json(
        { error: "Booking is not confirmed", status: booking.status },
        { status: 400 }
      );
    }

    if (booking.booking_date !== today) {
      logAudit(user.id, "check_in.failed", "booking", booking.id, {
        reason: "wrong_date", expected: booking.booking_date, actual: today,
      }).catch(() => {});
      return NextResponse.json(
        {
          error: `Booking is for ${booking.booking_date}, not today`,
          bookingDate: booking.booking_date,
        },
        { status: 400 }
      );
    }

    if (booking.qr_used) {
      logAudit(user.id, "check_in.failed", "booking", booking.id, {
        reason: "already_used", code: code.slice(0, 8),
      }).catch(() => {});
      return NextResponse.json(
        { error: "QR code has already been used" },
        { status: 400 }
      );
    }

    // Mark QR as used and update booking status
    await supabase
      .from("bookings")
      .update({
        qr_used: true,
        status: "checked_in",
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id);

    // Create check-in record
    await supabase.from("check_ins").insert({
      user_id: booking.user_id,
      booking_id: booking.id,
      check_in_type: "day_pass",
      checked_in_at: new Date().toISOString(),
      checked_in_by: user.id,
    });

    // Get user name
    const { data: checkedInProfile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", booking.user_id)
      .single();

    // Audit log
    logAudit(user.id, "check_in.day_pass", "booking", booking.id, {
      member: checkedInProfile?.full_name || checkedInProfile?.email,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      type: "day_pass",
      name: checkedInProfile?.full_name || checkedInProfile?.email || "Unknown",
      date: booking.booking_date,
    });
  }

  // Try monthly membership (membership ID match)
  const { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("id", code)
    .single();

  if (membership) {
    if (!membership.is_active) {
      logAudit(user.id, "check_in.failed", "membership", membership.id, {
        reason: "inactive",
      }).catch(() => {});
      return NextResponse.json(
        { error: "Membership is not active" },
        { status: 400 }
      );
    }

    if (new Date(membership.expires_at) < new Date()) {
      logAudit(user.id, "check_in.failed", "membership", membership.id, {
        reason: "expired", expires_at: membership.expires_at,
      }).catch(() => {});
      return NextResponse.json(
        { error: "Membership has expired" },
        { status: 400 }
      );
    }

    // Check if already checked in today
    const { data: existingCheckIn } = await supabase
      .from("check_ins")
      .select("id")
      .eq("user_id", membership.user_id)
      .eq("check_in_type", "monthly")
      .gte("checked_in_at", `${today}T00:00:00`)
      .lt("checked_in_at", `${today}T23:59:59`)
      .single();

    if (existingCheckIn) {
      logAudit(user.id, "check_in.failed", "membership", membership.id, {
        reason: "already_checked_in_today",
      }).catch(() => {});
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 400 }
      );
    }

    // Create check-in record
    await supabase.from("check_ins").insert({
      user_id: membership.user_id,
      membership_id: membership.id,
      check_in_type: "monthly",
      checked_in_at: new Date().toISOString(),
      checked_in_by: user.id,
    });

    const { data: checkedInProfile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", membership.user_id)
      .single();

    // Audit log
    logAudit(user.id, "check_in.monthly", "membership", membership.id, {
      member: checkedInProfile?.full_name || checkedInProfile?.email,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      type: "monthly",
      name: checkedInProfile?.full_name || checkedInProfile?.email || "Unknown",
    });
  }

  logAudit(user.id, "check_in.failed", "unknown", code.slice(0, 8), {
    reason: "no_match",
  }).catch(() => {});

  return NextResponse.json(
    { error: "Invalid code. No matching booking or membership found." },
    { status: 404 }
  );
}
