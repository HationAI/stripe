/* pages/cancel.tsx
   – Called by Stripe when the customer closes the window or clicks “Cancel”.
   – Works exactly like the success page, but shows a friendly “cancellation” message.
*/

import { NextResponse } from "next/server";

async function getSession(sessionId: string) {
  const stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY as string
  );
  return await stripe.checkout.sessions.retrieve(sessionId);
}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return new Response(
      "⚠️ No session_id supplied. The customer likely closed the window.",
      { status: 400 }
    );
  }

  try {
    const session = await getSession(sessionId);

    const amountTotal = (session.amount_total ?? 0) / 100;
    const currency = session.currency?.toUpperCase() ?? "USD";
    const customerEmail = session.customer_details?.email ?? "N/A";
    const status = session.status ?? "unknown";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment cancelled</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:2rem auto;line-height:1.5;color:#333}
    .alert{border:1px solid #e74c3c;border-radius:8px;padding:2rem;background:#fdf2f2;color:#c0392b}
    h1{color:#c0392b;margin-top:0}
    a{color:#3498db;text-decoration:none;margin-top:1rem;display:block}
  </style>
</head>
<body>
  <div class="alert">
    <h1>❌ Payment cancelled</h1>
    <p>Your payment was not completed.</p>

    <div>
      <strong>Amount:</strong> $${amountTotal.toFixed(2)} <strong>currency:</strong> <code>${currency}</code><br/>
      <strong>Customer e‑mail:</strong> ${customerEmail}
    </div>

    <p style="margin-top:2rem;">
      <a href="/">← Return to home</a>
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