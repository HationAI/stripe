/* pages/index.tsx
   – Simple home page with a button that opens a Stripe Checkout.
   – The checkout's success_url and cancel_url should point at
   /payments/success?session_id={CHECKOUT_SESSION_ID}
   and /payments/cancel respectively.
*/

"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const handlePay = async () => {
    // Call our API route to get a real Stripe Checkout URL
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Could not create checkout: " + (err.error || res.statusText));
      return;
    }

    const { url } = await res.json();

    // Open Stripe's hosted Checkout page
    window.open(url, "_blank");
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
        Pay now (single‑payment $15)
      </button>

      {open && (
        <p style={{ marginTop: "1rem", color: "#666" }}>
          Checkout window opened. Return here after you finish.
        </p>
      )}
    </main>
  );
}