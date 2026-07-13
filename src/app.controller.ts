import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getHomePage(): string {
    return `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Booking Platform API</title>
          <style>
            :root {
              color-scheme: light;
              --bg: #0f172a;
              --panel: #111827;
              --card: #1f2937;
              --text: #e5e7eb;
              --muted: #9ca3af;
              --accent: #38bdf8;
              --accent-2: #22c55e;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              min-height: 100vh;
              font-family: Arial, Helvetica, sans-serif;
              background:
                radial-gradient(circle at top, rgba(56, 189, 248, 0.22), transparent 32%),
                linear-gradient(160deg, #020617 0%, #0f172a 45%, #111827 100%);
              color: var(--text);
              display: grid;
              place-items: center;
              padding: 24px;
            }

            .wrap {
              width: 100%;
              max-width: 760px;
              background: rgba(17, 24, 39, 0.88);
              border: 1px solid rgba(148, 163, 184, 0.18);
              border-radius: 24px;
              padding: 40px;
              box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
              backdrop-filter: blur(16px);
            }

            .badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 14px;
              border-radius: 999px;
              background: rgba(56, 189, 248, 0.12);
              color: var(--accent);
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 0.02em;
              margin-bottom: 20px;
            }

            h1 {
              margin: 0 0 12px;
              font-size: clamp(32px, 5vw, 56px);
              line-height: 1.05;
            }

            p {
              margin: 0 0 18px;
              color: var(--muted);
              line-height: 1.7;
              font-size: 16px;
            }

            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 14px;
              margin-top: 28px;
            }

            .card {
              background: rgba(31, 41, 55, 0.9);
              border: 1px solid rgba(148, 163, 184, 0.16);
              border-radius: 18px;
              padding: 18px;
            }

            .card h2 {
              margin: 0 0 8px;
              font-size: 16px;
            }

            .card p {
              margin: 0;
              font-size: 14px;
            }

            a {
              color: var(--accent);
              text-decoration: none;
              font-weight: 700;
            }

            .footer {
              margin-top: 24px;
              padding-top: 18px;
              border-top: 1px solid rgba(148, 163, 184, 0.16);
              display: flex;
              flex-wrap: wrap;
              gap: 14px;
              justify-content: space-between;
              align-items: center;
            }

            .cta {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 12px 18px;
              border-radius: 12px;
              background: linear-gradient(135deg, var(--accent), var(--accent-2));
              color: #04111f;
              font-weight: 800;
            }
          </style>
        </head>
        <body>
          <main class="wrap">
            <div class="badge">Booking Platform API</div>
            <h1>Welcome to the Booking Platform</h1>
            <p>
              This is the backend service for managing authentication, services,
              and customer bookings.
            </p>
            <p>
              Use the API documentation to explore endpoints and test requests
              directly in your browser.
            </p>

            <div class="grid">
              <section class="card">
                <h2>Swagger Docs</h2>
                <p><a href="/docs">Open API documentation</a></p>
              </section>
              <section class="card">
                <h2>Auth</h2>
                <p>Register and log in with JWT.</p>
              </section>
              <section class="card">
                <h2>Bookings</h2>
                <p>Create and manage customer bookings.</p>
              </section>
            </div>

            <div class="footer">
              <span>API base path: <strong>/api</strong></span>
              <a class="cta" href="/docs">Go to Swagger</a>
            </div>
          </main>
        </body>
      </html>
    `;
  }
}
