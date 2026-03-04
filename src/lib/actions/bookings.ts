"use server";

import { createClient } from "@/lib/supabase/server";
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
