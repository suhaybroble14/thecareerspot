import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const MEMBERSHIP_PLANS = {
  day_pass: {
    id: "day_pass",
    name: "Day Pass",
    price: 999,
    priceFormatted: "£9.99",
    duration: "10 hours",
    description: "Active for 10 hours",
  },
  "30_day": {
    id: "30_day",
    name: "30 Day",
    price: 4099,
    priceFormatted: "£40.99",
    duration: "30 days",
    description: "24/7 access for 30 days",
  },
};

export async function createDayPassCheckout(
  userId: string,
  userEmail: string,
  bookingId: string,
  bookingDate: string,
  appUrl: string
) {
  const plan = MEMBERSHIP_PLANS.day_pass;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Day Pass - ${bookingDate}`,
            description: plan.description,
          },
          unit_amount: plan.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: userEmail,
    metadata: {
      userId,
      planId: "day_pass",
      bookingId,
      bookingDate,
    },
    success_url: `${appUrl}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/day-pass`,
  });

  return session;
}

export async function createMembershipCheckout(
  userEmail: string,
  applicationId: string,
  appUrl: string
) {
  const plan = MEMBERSHIP_PLANS["30_day"];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: plan.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: userEmail,
    metadata: {
      planId: "30_day",
      applicationId,
    },
    success_url: `${appUrl}/dashboard?membership=activated`,
    cancel_url: `${appUrl}/dashboard`,
  });

  return session;
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

export async function handleStripeWebhook(
  signature: string,
  body: Buffer,
  secret: string
) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err}`);
  }

  return event;
}
