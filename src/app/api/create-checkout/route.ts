export const runtime = "nodejs";

import { NextResponse } from "next/server";

/* -------------------------------------------------
   👉 REPLACE THESE WITH YOUR ACTUAL VALUES
   ------------------------------------------------- */
const PRICE_ID = "price_1KkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"; // <-- your $49‑monthly price ID

/* Replace with the Vercel domain that will receive the redirects */
const SUCCESS_URL = "https://YOUR_VERCEL_URL/payments/success?session_id={CHECKOUT_SESSION_ID}";
const CANCEL_URL  = "https://YOUR_VERCEL_URL/payments/cancel";
 /* ------------------------------------------------- */

export const POST = async (request: Request) => {
  // Dynamically import Stripe so the build does NOT try to evaluate
  // process.env.STRIPE_SECRET_KEY at compile‑time.
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  try {
    // @ts-ignore – typescript types for Stripe may not match the dynamic import exactly
    const session: any = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      // @ts-ignore
      subscription_data: {
        // @ts-ignore
        setup_fee: {
          amount: 24900,   // $249 in cents
          interval: "once",
        },
      },

      success_url: SUCCESS_URL,
      cancel_url:  CANCEL_URL,
    });

    // Return everything the UI may want to display.
    return NextResponse.json({
      url: session.url,                // Stripe‑hosted page the user opens
      setupFee: 24900,                // for UI friendly show‑through
      monthlyAmount: 4900,            // $49 in cents (the price you created)
    });
  } catch (err: any) {
    console.error("Stripe checkout creation error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
};