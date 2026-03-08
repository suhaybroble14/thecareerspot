import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAvailability } from "@/lib/capacity";
import crypto from "crypto";

const stripeConfigured =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "sk_test_placeholder";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { date } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Validate date is not in the past
    const bookingDate = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return NextResponse.json(
        { error: "Cannot book a date in the past" },
        { status: 400 }
      );
    }

    // Check availability (uses anon client, reads confirmed bookings)
    const availability = await getAvailability(date);
    if (availability.available <= 0) {
      return NextResponse.json(
        { error: "No spots available for this date" },
        { status: 409 }
      );
    }

    // Check if user already has a booking for this date
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", user.id)
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"])
      .single();

    if (existingBooking) {
      return NextResponse.json(
        { error: "You already have a booking for this date" },
        { status: 409 }
      );
    }

    const qrCode = crypto.randomUUID();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    if (stripeConfigured) {
      // ── STRIPE FLOW ──────────────────────────────────────────────────────
      const { createDayPassCheckout } = await import("@/lib/stripe");

      // Use admin client to insert (bypasses RLS insert policies if needed)
      const admin = createAdminClient();
      const { data: booking, error: bookingError } = await admin
        .from("bookings")
        .insert({
          user_id: user.id,
          booking_date: date,
          qr_code: qrCode,
          status: "pending",
          amount_paid: 9.99,
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        return NextResponse.json(
          { error: "Failed to create booking" },
          { status: 500 }
        );
      }

      let session;
      try {
        session = await createDayPassCheckout(
          user.id,
          user.email!,
          booking.id,
          date,
          appUrl
        );
      } catch (stripeError) {
        // Clean up the pending booking so the user can try again
        await admin.from("bookings").delete().eq("id", booking.id);
        console.error("Stripe checkout error:", stripeError);
        return NextResponse.json(
          { error: "Payment setup failed. Please try again." },
          { status: 500 }
        );
      }

      await admin
        .from("bookings")
        .update({ stripe_session_id: session.id })
        .eq("id", booking.id);

      return NextResponse.json({ checkoutUrl: session.url });
    } else {
      // ── NO-STRIPE FLOW (dev / demo) ──────────────────────────────────────
      // Confirm directly. Use admin client so RLS doesn't block the insert.
      const admin = createAdminClient();
      const { data: booking, error: bookingError } = await admin
        .from("bookings")
        .insert({
          user_id: user.id,
          booking_date: date,
          qr_code: qrCode,
          status: "confirmed",
          amount_paid: 0,
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        return NextResponse.json(
          { error: "Failed to create booking" },
          { status: 500 }
        );
      }

      // TODO: integrate Stripe for real payments
      return NextResponse.json({
        checkoutUrl: `${appUrl}/booking-confirmed?bookingId=${booking.id}`,
      });
    }
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
