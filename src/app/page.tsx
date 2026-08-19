"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const handlePay = () => {
    // Replace with your actual Vercel URL and price ID
    const successUrl = "https://YOUR_VERCEL_URL/payments/success?session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl = "https://YOUR_VERCEL_URL/payments/cancel";

    window.open(
      `https://checkout.stripe.com/c/pay/cs_test_????.????.????.??????
        ?success_url=${successUrl}&
        cancel_url=${cancelUrl}&
        line_items[0][price]=price_1KkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz&
        line_items[0][quantity]=1`,
      "_blank"
    );
    setOpen(true);
  };

  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        lineHeight: "1.5",
        color: "#333",
      }}
    >
      <h1>Welcome – Payment Demo</h1>

      <p>
        Click the button below to open a Stripe Checkout. After the payment
        completes (or is cancelled) Stripe will redirect you back to the
        /payments/success or /payments/cancel page.
      </p>

      <button
        onClick={handlePay}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#635bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Pay now (monthly $15)
      </button>

      {open && (
        <p style={{ marginTop: "1rem", color: "#666" }}>
          Checkout window opened. Return here after you finish.
        </p>
      )}
    </main>
  );
}