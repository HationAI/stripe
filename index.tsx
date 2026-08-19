/* pages/index.tsx
   – Simple home page with a button that opens a Stripe Checkout.
   – The checkout’s success_url and cancel_url should point at
   /payments/success?session_id={CHECKOUT_SESSION_ID}
   and /payments/cancel respectively.
*/

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const handlePay = () => {
    // When you run the ChatGPT prompt, replace the placeholders
    // with the actual URLs that your Vercel deployment provides.
    const successUrl = encodeURIComponent(
      "https://YOUR_VERCEL_URL/payments/success?session_id={CHECKOUT_SESSION_ID}"
    );
    const cancelUrl = encodeURIComponent(
      "https://YOUR_VERCEL_URL/payments/cancel"
    );

    // Open Stripe's pre‑built Checkout page in a new tab.
    // You can also use the Stripe SDK to create a Session server‑side
    // and then redirect the browser.
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
        {"/payments/success"} or {"/payments/cancel"} page that we've already
        created.
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