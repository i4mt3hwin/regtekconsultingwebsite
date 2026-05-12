// Cloudflare Pages Function — handles contact form submissions.
// Invoked at POST /api/contact. Calls Resend twice:
//   1. Internal lead notification → Kevin (critical; failure = 502)
//   2. Branded auto-receipt → the lead (best-effort; failure logs but returns 200)
//
// Required env var (set in Pages project → Settings → Environment variables):
//   RESEND_API_KEY   (secret)

interface Env {
  RESEND_API_KEY: string;
}

const FROM_EMAIL = "contact@regtekconsulting.com";
const TO_EMAIL = "kdillon@regtekconsulting.com";
const CONFIRMATION_FROM = "Regtek Consulting <noreply@regtekconsulting.com>";
const CONFIRMATION_REPLY_TO = "kdillon@regtekconsulting.com";
const SITE_URL = "https://regtekconsulting.com";
const CASE_STUDIES_URL = `${SITE_URL}/blog/category/case-studies-results`;

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
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

async function sendResend(apiKey: string, payload: Record<string, unknown>): Promise<Response> {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

type Row = [label: string, value: string];

function buildRows(data: FormPayload, firstName: string, email: string): Row[] {
  return [
    ["Name", `${firstName} ${(data.lastName ?? "").trim()}`.trim()],
    ["Email", email],
    ["Phone", (data.phone ?? "").trim() || "—"],
    ["Company", (data.company ?? "").trim() || "—"],
    ["Budget", (data.budget ?? "").trim() || "—"],
  ];
}

function buildNotificationHtml(firstName: string, lastName: string, rows: Row[], message: string): string {
  return `
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
}

function buildConfirmationEmail(firstName: string, rows: Row[], message: string): { html: string; text: string } {
  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td class="rt-label" style="padding:4px 12px 4px 0;color:#555;vertical-align:top;width:90px"><strong>${escape(k)}</strong></td><td class="rt-value" style="padding:4px 0;color:#0A0A0B">${escape(v)}</td></tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Thanks for reaching out!</title>
<style>
  body { margin:0; padding:0; background:#E5E7EB; }
  @media (prefers-color-scheme: dark) {
    body, .rt-page-bg { background:#0A0A0B !important; }
    .rt-card { background:#18181B !important; }
    .rt-body, .rt-value, .rt-message-body { color:#F4F4F5 !important; }
    .rt-label, .rt-muted { color:#A1A1AA !important; }
    .rt-heading { color:#22D3EE !important; }
    .rt-eyebrow { color:#22D3EE !important; }
    .rt-submission { background:#0A0A0B !important; border-color:#27272A !important; }
    .rt-divider { border-top-color:#27272A !important; }
    .rt-footer { color:#A1A1AA !important; border-top-color:#27272A !important; }
    .rt-footer-link { color:#22D3EE !important; }
  }
</style>
</head>
<body class="rt-page-bg" style="margin:0;padding:40px 16px;background:#E5E7EB;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <div class="rt-card" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden">

    <div style="background:linear-gradient(135deg,#0E7490 0%,#155E75 100%);padding:32px 24px;text-align:center">
      <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.12em">REGTEK CONSULTING</div>
      <div style="color:#A5F3FC;font-size:13px;margin-top:4px;letter-spacing:0.04em">Data-driven marketing. Real results.</div>
    </div>

    <div class="rt-body" style="padding:32px 24px;color:#0A0A0B;font-size:15px;line-height:1.6">
      <h1 class="rt-heading" style="margin:0 0 20px;font-size:24px;font-weight:700;color:#0E7490;letter-spacing:-0.01em">Thanks for Reaching Out!</h1>
      <p style="margin:0 0 16px">Hi ${escape(firstName)},</p>
      <p style="margin:0 0 16px">I received your message.</p>
      <p style="margin:0 0 16px">I personally review every inquiry and will be in touch <strong>within one to two business days</strong>.</p>
      <p style="margin:0 0 8px">Kevin Dillon<br><span class="rt-muted" style="color:#555;font-size:13px">Founder, Regtek Consulting</span></p>
    </div>

    <div class="rt-submission" style="margin:0 24px 32px;padding:20px;border:1px solid #E5E7EB;border-radius:8px;background:#F9FAFB">
      <div class="rt-eyebrow" style="font-size:12px;font-weight:600;color:#0E7490;letter-spacing:0.08em;margin-bottom:12px">YOUR SUBMISSION</div>
      <table style="border-collapse:collapse;font-size:14px;width:100%">
        ${rowsHtml}
      </table>
      <div class="rt-divider" style="margin-top:16px;padding-top:16px;border-top:1px solid #E5E7EB">
        <div class="rt-label" style="color:#555;font-size:12px;font-weight:600;margin-bottom:6px">MESSAGE</div>
        <div class="rt-message-body" style="white-space:pre-wrap;font-size:14px;line-height:1.5;color:#0A0A0B">${escape(message)}</div>
      </div>
    </div>

    <div style="padding:0 24px 32px;text-align:center">
      <p class="rt-muted" style="margin:0 0 12px;color:#555;font-size:14px">While you wait</p>
      <a href="${CASE_STUDIES_URL}" style="display:inline-block;padding:12px 24px;background:#06B6D4;color:#ffffff;text-decoration:none;font-weight:600;border-radius:6px;font-size:14px">See recent case studies &rarr;</a>
    </div>

    <div class="rt-footer" style="padding:20px 24px;border-top:1px solid #E5E7EB;color:#9CA3AF;font-size:12px;line-height:1.5;text-align:center">
      This is an automated confirmation from regtekconsulting.com. Replies go to Kevin.<br>
      Regtek Consulting &middot; <a class="rt-footer-link" href="${SITE_URL}" style="color:#0E7490;text-decoration:none">regtekconsulting.com</a>
    </div>

  </div>
</body>
</html>`;

  const labelWidth = 9;
  const rowsText = rows
    .map(([k, v]) => `${(k + ":").padEnd(labelWidth)} ${v}`)
    .join("\n");

  const text = `Hi ${firstName},

Thanks for Reaching Out! I received your message.

I personally review every inquiry and will be in touch within one to two business days.

Kevin Dillon
Founder, Regtek Consulting


YOUR SUBMISSION
${rowsText}

Message:
${message}


While you wait, see recent case studies:
${CASE_STUDIES_URL}

---
This is an automated confirmation from regtekconsulting.com.
Regtek Consulting · ${SITE_URL}
`;

  return { html, text };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: FormPayload;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // Honeypot: bots fill this; return fake-success, send nothing.
  if (data.website && data.website.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const firstName = (data.firstName ?? "").trim();
  const lastName = (data.lastName ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();

  if (!firstName) return json({ ok: false, error: "First name is required." }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Please enter a valid email." }, 400);
  if (!message) return json({ ok: false, error: "Please include a message." }, 400);

  const rows = buildRows(data, firstName, email);
  const notificationHtml = buildNotificationHtml(firstName, lastName, rows, message);
  const confirmation = buildConfirmationEmail(firstName, rows, message);

  const notificationPayload = {
    from: FROM_EMAIL,
    to: TO_EMAIL,
    reply_to: email,
    subject: `[Regtek] New lead: ${firstName} ${lastName}`.trim(),
    html: notificationHtml,
  };

  const confirmationPayload = {
    from: CONFIRMATION_FROM,
    to: email,
    reply_to: CONFIRMATION_REPLY_TO,
    subject: "Thanks for reaching out!",
    html: confirmation.html,
    text: confirmation.text,
  };

  const [notifyResult, confirmResult] = await Promise.allSettled([
    sendResend(env.RESEND_API_KEY, notificationPayload),
    sendResend(env.RESEND_API_KEY, confirmationPayload),
  ]);

  // Notification to Kevin is critical — fail the request if it didn't go through.
  if (notifyResult.status === "rejected") {
    console.error("Resend lead-notification rejected", notifyResult.reason);
    return json({ ok: false, error: "Email service unavailable." }, 502);
  }
  if (!notifyResult.value.ok) {
    const detail = await notifyResult.value.text();
    console.error("Resend lead-notification error", notifyResult.value.status, detail);
    return json({ ok: false, error: "Email service unavailable." }, 502);
  }

  // Auto-receipt to the lead is best-effort — log but don't fail the request.
  if (confirmResult.status === "rejected") {
    console.error("Resend auto-receipt rejected (non-fatal)", confirmResult.reason);
  } else if (!confirmResult.value.ok) {
    const detail = await confirmResult.value.text();
    console.error("Resend auto-receipt error (non-fatal)", confirmResult.value.status, detail);
  }

  return json({ ok: true }, 200);
};
