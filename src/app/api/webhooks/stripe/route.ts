import { NextRequest, NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  dayPassConfirmationEmail,
  membershipActivatedEmail,
} from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = Buffer.from(await request.arrayBuffer());
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = await handleStripeWebhook(signature, body, webhookSecret);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;

    if (!metadata) {
      console.error("No metadata on session");
      return NextResponse.json({ received: true });
    }

    const planId = metadata.planId;
    const paymentIntent = session.payment_intent as string;

    // Duplicate payment protection: check if this payment_intent was already processed
    const { data: existingTx } = await supabase
      .from("transactions")
      .select("id")
      .eq("stripe_payment_id", paymentIntent)
      .single();

    if (existingTx) {
      console.log("Duplicate webhook for payment:", paymentIntent);
      return NextResponse.json({ received: true });
    }

    // Day pass booking
    if (planId === "day_pass" && metadata.bookingId) {
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          stripe_payment_intent_id: paymentIntent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", metadata.bookingId)
        .eq("status", "pending"); // Only update if still pending

      if (bookingError) {
        console.error("Failed to update booking:", bookingError);
      }

      // Create transaction record
      if (metadata.userId) {
        await supabase.from("transactions").insert({
          user_id: metadata.userId,
          stripe_payment_id: paymentIntent,
          amount: 9.99,
          currency: "gbp",
          status: "succeeded",
        });

        // Get booking + user info for email
        const { data: booking } = await supabase
          .from("bookings")
          .select("booking_date, qr_code")
          .eq("id", metadata.bookingId)
          .single();

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", metadata.userId)
          .single();

        if (profile?.email && booking) {
          sendEmail({
            to: profile.email,
            subject: "Your receipt — The Spot day pass",
            html: dayPassConfirmationEmail(
              profile.full_name || "",
              booking.booking_date,
              booking.qr_code,
              paymentIntent
            ),
          }).catch(() => {});

          // Notify The Career Spot
          sendEmail({
            to: "thecareerspot0@gmail.com",
            subject: `New day pass booked — ${booking.booking_date}`,
            html: `<p><strong>${profile.full_name || profile.email}</strong> (${profile.email}) has purchased a day pass for <strong>${booking.booking_date}</strong>. Amount: £9.99.</p>`,
          }).catch(() => {});
        }
      }
    }

    // 30 day membership (admin-triggered)
    if (planId === "30_day" && metadata.applicationId) {
      const { data: application } = await supabase
        .from("membership_applications")
        .select("*")
        .eq("id", metadata.applicationId)
        .single();

      if (application?.user_id) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const { data: membership } = await supabase
          .from("memberships")
          .insert({
            user_id: application.user_id,
            membership_type: "30_day",
            amount_paid: 40.99,
            expires_at: expiresAt.toISOString(),
            is_active: true,
          })
          .select()
          .single();

        await supabase
          .from("membership_applications")
          .update({
            status: "approved",
            updated_at: new Date().toISOString(),
          })
          .eq("id", metadata.applicationId);

        await supabase.from("transactions").insert({
          user_id: application.user_id,
          membership_id: membership?.id,
          stripe_payment_id: paymentIntent,
          amount: 40.99,
          currency: "gbp",
          status: "succeeded",
        });

        // Send membership activated email
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", application.user_id)
          .single();

        if (profile?.email && membership) {
          sendEmail({
            to: profile.email,
            subject: "Membership activated - The Spot",
            html: membershipActivatedEmail(
              profile.full_name || application.full_name,
              membership.expires_at
            ),
          }).catch(() => {});
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
