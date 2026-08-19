export const runtime = "nodejs";

import { NextResponse } from "next/server";

/* -------------------------------------------------
   👉 REPLACE THESE WITH YOUR ACTUAL Price IDs
   ------------------------------------------------- */
const PRICE_SETUP_ID = "price_1U6Cs8C2FWObrmEWIuJAOEHW"; // $249 one‑time (Price A)
const PRICE_MONTHLY_ID = "price_1U6Ct6C2FWObrmEWu8urUKEQ"; // $49 monthly (Price B)

/* Replace with the Vercel domain that will receive the redirects */
const SUCCESS_URL = "https://stripe-three-xi.vercel.app/payments/success?session_id={CHECKOUT_SESSION_ID}";
const CANCEL_URL  = "https://stripe-three-xi.vercel.app/payments/cancel";
/* ------------------------------------------------- */

export const POST = async (request: Request) => {
  // Dynamically import Stripe so the build does NOT evaluate the secret key at compile time.
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-09-30",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",                // subscription mode
      payment_method_types: ["card"],      // shown in the UI
      line_items: [
        // 1️⃣ One‑time setup fee
        {
          price: PRICE_SETUP_ID,
          quantity: 1,
        },
        // 2️⃣ Monthly recurring fee
        {
          price: PRICE_MONTHLY_ID,
          quantity: 1,
        },
      ],
      // No subscription_data.setup_fee any more – Stripe handles it via the two line‑items.
      success_url: SUCCESS_URL,
      cancel_url:  CANCEL_URL,
    });

    // Return the Stripe‑hosted URL + the two amounts for the UI.
    return NextResponse.json({
      url: session.url,                // Open this in a new tab
      setupFee: 24900,                // $249 in cents (for UI display)
      monthlyAmount: 4900,            // $49 in cents (for UI display)
    });
  } catch (err: any) {
    console.error("Stripe checkout creation error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
};