# regtek-contact worker

Cloudflare Worker that accepts POSTs from the Regtek contact form and sends an email via Resend.

## One-time setup

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY   # paste your Resend API key
```

In Resend, verify the sending domain (whatever you set `FROM_EMAIL` to in `wrangler.toml`). Until the domain is verified, Resend will reject the send.

Edit `wrangler.toml` if `FROM_EMAIL` or `TO_EMAIL` need to change.

## Deploy

```bash
npx wrangler deploy
```

Wrangler prints a URL like `https://regtek-contact.<account>.workers.dev`. The form endpoint is `{URL}/submit`.

Paste that base URL into `05-build/src/pages/contact.astro` — look for `const WORKER_URL = "..."` near the top of the inline `<script>`.

## Custom domain (optional)

Uncomment the `[[routes]]` block in `wrangler.toml` to bind the Worker to `forms.regtekconsulting.com/*` (requires the zone to be on Cloudflare). Re-run `wrangler deploy`. Then update `WORKER_URL` in the site to the custom URL.

## Test

```bash
# From the site in dev (http://localhost:4321/contact)
# Submit the form; check the Resend dashboard and your inbox.

# Or curl directly:
curl -X POST https://regtek-contact.<account>.workers.dev/submit \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:4321" \
  -d '{"firstName":"Test","email":"you@example.com","message":"hi"}'
```

Honeypot: a hidden `website` field. Bots that fill it get a 200 response but no email is sent.

## Tail logs

```bash
npx wrangler tail
```
