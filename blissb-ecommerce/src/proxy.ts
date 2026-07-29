import { NextRequest, NextResponse } from 'next/server';

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bliss-B Desserts — Coming Soon</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f4f0;
      color: #8F4B2B;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      text-align: center;
      padding: 24px;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #6b5b4f; font-size: 1.1rem; }
  </style>
</head>
<body>
  <div>
    <h1>Bliss-B Desserts</h1>
    <p>We're baking something new. Back soon! 🍪</p>
  </div>
</body>
</html>`;

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== 'true') {
    return NextResponse.next();
  }

  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img).*)'],
};
