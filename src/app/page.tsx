/*  Home page – opens a Stripe Checkout that charges:
    • $249 one‑time setup fee (first payment)
    • $49 every month thereafter
  The Checkout UI is Stripe‑hosted, so no “link is incomplete” error.
*/

"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const handlePay = async () => {
    // 👉 Replace the URL below with your real Vercel domain
    const successUrl = "https://YOUR_VERCEL_URL/payments/success?session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl  = "https://YOUR_VERCEL_URL/payments/cancel";

    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // These values are used only for the UI preview; the real values come from the API.
        // successUrl / cancelUrl are read from the API response, but we keep them here
        // just in case the API call fails.
        successUrl,
        cancelUrl,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Could not create checkout: " + (err.error || res.statusText));
      return;
    }

    const { url, setupFee, monthlyAmount } = await res.json();

    // Open Stripe’s hosted Checkout page
    window.open(url, "_blank");
    setOpen(true);

    // OPTIONAL: show a quick inline notice (you could also display this on the success page)
    console.log("👉 Setup fee: $", (setupFee / 100).toFixed(2));
    console.log("👉 Monthly fee: $", (monthlyAmount / 100).toFixed(2));
  };

  return (
    <main
      style={{
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        maxWidth: "680px",
        margin: "2rem auto",
        padding: "2rem 1.5rem",
        lineHeight: "1.5",
        color: "#222",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        background: "#f8f9fa",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Monthly Maintenance Subscription</h1>

      <p>
        One‑time setup fee: <strong>$249</strong> then <strong>$49</strong> every month.
        Click the button below to pay with Stripe.
      </p>

      <button
        onClick={handlePay}
        style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.85rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Start subscription ($249 setup + $49 /mo)
      </button>

      {open && (
        <p style={{ marginTop: "1rem", color: "#64748b" }}>
          Checkout window opened. Return here after you finish.
        </p>
      )}
    </main>
  );
}