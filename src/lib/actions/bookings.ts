"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Booking } from "@/lib/supabase/types";

export async function getMyBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("booking_date", { ascending: false });

  if (error) {
    console.error("Fetch bookings error:", error);
    return [];
  }

  return data as Booking[];
}

export async function getUpcomingBooking(): Promise<Booking | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .gte("booking_date", today)
    .order("booking_date", { ascending: true })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fetch upcoming booking error:", error);
  }

  return (data as Booking) || null;
}

export async function requestRefund(bookingId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (!booking) return { success: false, error: "Booking not found" };
  if (booking.status !== "confirmed") {
    return { success: false, error: "Only confirmed bookings can be refunded" };
  }

  const today = new Date().toISOString().split("T")[0];
  if (booking.booking_date <= today) {
    return { success: false, error: "Cannot request a refund for today or past dates" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("bookings")
    .update({ status: "cancellation_requested", refund_reason: reason, updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) return { success: false, error: "Failed to request refund" };

  // Notify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { sendEmail } = await import("@/lib/email/sendEmail");
  sendEmail({
    to: "thecareerspot0@gmail.com",
    subject: `Refund request — ${booking.booking_date}`,
    html: `<p><strong>${profile?.full_name || profile?.email}</strong> (${profile?.email}) has requested a refund for their day pass on <strong>${booking.booking_date}</strong>.</p><p><strong>Reason:</strong> ${reason}</p><p>Review it in the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/refunds">admin panel</a>.</p>`,
  }).catch(() => {});

  return { success: true };
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Verify the booking belongs to the user and is cancellable
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.status !== "confirmed") {
    return { success: false, error: "Only confirmed bookings can be cancelled" };
  }

  const today = new Date().toISOString().split("T")[0];
  if (booking.booking_date <= today) {
    return { success: false, error: "Cannot cancel a booking for today or past dates" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) {
    console.error("Cancel booking error:", error);
    return { success: false, error: "Failed to cancel booking" };
  }

  return { success: true };
}
