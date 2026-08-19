/* pages/success.tsx
   – Called by Stripe after a successful payment/subscription.
   – Reads the session_id from the query string.
   – Fetches the Checkout Session (or PaymentIntent) from Stripe.
   – Shows a receipt‑style confirmation.
*/

import { NextResponse } from "next/server";

/* ----------------------------------------------------------------- */
async function getSession(sessionId: string) {
  // 👉 Put your Stripe secret key in Vercel → Environment Variables
  const stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY as string
  );

  // If you created a Checkout Session:
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}
/* ----------------------------------------------------------------- */

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return new Response(
      "⚠️ No session_id supplied. Please come from the Stripe Checkout flow.",
      { status: 400 }
    );
  }

  try {
    const session = await getSession(sessionId);

    // ---- Build a friendly receipt ----
    const amountTotal = (session.amount_total ?? 0) / 100; // Stripe stores cents
    const currency = session.currency?.toUpperCase() ?? "USD";
    const customerEmail = session.customer_details?.email ?? "N/A";
    const status = session.status;

    // If it's a Subscription, pull a few extra bits
    let subscriptionInfo = "";
    if (session.subscription) {
      const sub = await stripe.substances.retrieve(session.subscription as string);
      subscriptionInfo = `
        <h3>Subscription ID</h3>
        <p><strong>${sub.id}</strong></p>
        <p>Current period ends: <em>${new Date(
          sub.current_period_end * 1000
        ).toLocaleDateString()}</em></p>
      `;
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment successful 🎉</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:2rem auto;line-height:1.5;color:#333}
    .receipt{border:1px solid #eaeaea;border-radius:8px;padding:2rem;background:#f9f9f9}
    h1{color:#2c3e50;margin-top:0}
    .meta{margin-top:1rem}
    a{color:#3498db;text-decoration:none}
  </style>
</head>
<body>
  <div class="receipt">
    <h1>🎉 Payment received!</h1>
    <p>Thank you for your payment.</p>

    <div class="meta">
      <strong>Amount:</strong> $${amountTotal.toFixed(2)} <strong>currency:</strong> <code>${currency}</code><br/>
      <strong>Status:</strong> <span style="color:#27ae60;">${status}</span><br/>
      <strong>Customer e‑mail:</strong> ${customerEmail}
    </div>

    ${subscriptionInfo}

    <p style="margin-top:2rem;">
      <a href="/">← Back to home</a>
    </p>
  </div>
</body>
</html>
`;
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return new Response(`❗️ Stripe error: ${err.message}`, { status: 500 });
  }
};