export interface Env {
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  TO_EMAIL: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://www.regtekconsulting.com",
  "https://regtekconsulting.com",
  "http://localhost:4321",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" :
    c === "<" ? "&lt;" :
    c === ">" ? "&gt;" :
    c === '"' ? "&quot;" : "&#39;"
  );
}

interface FormPayload {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  budget?: string;
  message?: string;
  website?: string; // honeypot
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST" || url.pathname !== "/submit") {
      return json({ ok: false, error: "Not found" }, 404, origin);
    }

    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return json({ ok: false, error: "Forbidden origin" }, 403, origin);
    }

    let data: FormPayload;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, origin);
    }

    // Honeypot: bots will fill this. Pretend success, send nothing.
    if (data.website && data.website.trim() !== "") {
      return json({ ok: true }, 200, origin);
    }

    const firstName = (data.firstName ?? "").trim();
    const email = (data.email ?? "").trim();
    const message = (data.message ?? "").trim();

    if (!firstName) return json({ ok: false, error: "First name is required." }, 400, origin);
    if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Please enter a valid email." }, 400, origin);
    if (!message) return json({ ok: false, error: "Please include a message." }, 400, origin);

    const rows = [
      ["Name", `${firstName} ${(data.lastName ?? "").trim()}`.trim()],
      ["Email", email],
      ["Phone", (data.phone ?? "").trim() || "—"],
      ["Company", (data.company ?? "").trim() || "—"],
      ["Budget", (data.budget ?? "").trim() || "—"],
    ];

    const html = `
      <h2 style="margin:0 0 12px">New lead from regtekconsulting.com</h2>
      <table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 12px 4px 0;color:#555"><strong>${escape(k)}</strong></td><td style="padding:4px 0">${escape(v)}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px">Message</h3>
      <p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">${escape(message)}</p>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: env.TO_EMAIL,
        reply_to: email,
        subject: `[Regtek] New lead: ${firstName} ${(data.lastName ?? "").trim()}`.trim(),
        html,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      console.error("Resend error", resendRes.status, detail);
      return json({ ok: false, error: "Email service unavailable." }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
