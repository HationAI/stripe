import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "unknown";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale:1.0" />
  <title>Payment cancelled</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:2rem auto;line-height:1.5;color:#222}
    .card{border:1px solid #d1d9e1;border-radius:8px;padding:2rem;background:#f8f9fa}
    h1{color:#c53030;margin-top:0}
    .meta{margin-top:1rem;font-size:0.95rem}
    a{color:#3b82f3;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <h1>❌ Payment cancelled</h1>
    <p>Your subscription was not completed.</p>

    <div class="meta">
      <strong>You would have been charged:</strong><br/>
      • Setup fee: $249 (one‑time)<br/>
      • First month: $49 (recurring, if you had continued)
    </div>

    <p style="margin-top:2rem;">
      <a href="/">← Return home</a>
    </p>
  </div>
</body>
</html>
`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};