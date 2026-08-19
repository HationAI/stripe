import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "unknown";

  // Render a simple cancel page – no Stripe API call needed.
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale:1.0" />
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
    <p>Session ID: <code>${sessionId}</code></p>
    <p>If you think this is a mistake, please try again.</p>
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
};