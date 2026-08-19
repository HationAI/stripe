import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "unknown";

  // We read the query string only for display; the real data comes from the session
  // that was just created, but for a static page we just show a friendly message.
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale:1.0" />
  <title>Payment successful 🎉</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:2rem auto;line-height:1.5;color:#222}
    .card{border:1px solid #d1d9e1;border-radius:8px;padding:2rem;background:#f8f9fa}
    h1{color:#2c3e50;margin-top:0}
    .meta{margin-top:1rem;font-size:0.95rem}
    a{color:#3b82f3;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <h1>🎉 Payment received!</h1>
    <p>Thank you for subscribing to our monthly maintenance plan.</p>

    <div class="meta">
      <strong>Setup fee:</strong> $<span id="setup">249</span> (one‑time)<br/>
      <strong>First month:</strong> $<span id="monthly">49</span> (recurring)
    </div>

    <p style="margin-top:2rem;">
      <a href="/">← Return home</a>
    </p>
  </div>

  <script>
    // You could fetch the real amounts from Stripe if you wish,
    // but the hard‑coded values above match the price we created.
    document.getElementById('setup')!.textContent = "249";
    document.getElementById('monthly')!.textContent = "49";
  </script>
</body>
</html>
`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};