export const runtime = "nodejs";

import { NextResponse } from "next/server";

const PRICE_ID = "price_1U639CC2FWObrmEW6VJ7nHoe";

const SUCCESS_URL = "https://stripe-three-xi.vercel.app/payments/success?session_id={CHECKOUT_SESSION_ID}";
const CANCEL_URL  = "https://stripe-three-xi.vercel.app/payments/cancel";

export const POST = async (request: Request) => {
  // Dynamically import Stripe so the module is not statically analysed at build time.
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: SUCCESS_URL,
      cancel_url:  CANCEL_URL,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout creation error:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
};