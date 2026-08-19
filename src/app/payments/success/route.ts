import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "unknown";

  // Render a simple success page – no Stripe API call needed.
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
    <p>Session ID: <code>${sessionId}</code></p>
    <p>If you did not authorize this charge, please contact support.</p>
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
};