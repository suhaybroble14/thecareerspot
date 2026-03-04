# The Career Spot — Launch Checklist

## Environment Variables

Set these in your Vercel project settings (or `.env.local` for local dev):

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (never expose client-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (use `pk_live_` for production) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (use `sk_live_` for production) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `RESEND_API_KEY` | Yes | Resend API key for transactional emails |
| `RESEND_FROM` | Optional | From address (default: `The Spot <noreply@thecareerspot.com>`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Full app URL (e.g. `https://thecareerspot.com`) |

## Database Setup

1. Create a Supabase project
2. Run `src/lib/supabase/schema.sql` in the SQL Editor
3. Run `src/lib/supabase/schema-v2.sql` in the SQL Editor
4. Run `src/lib/supabase/schema-v3.sql` in the SQL Editor
5. Enable Realtime on: `bookings`, `check_ins`, `membership_applications`

## Supabase Auth

1. Enable Email provider in Authentication > Providers
2. Set Site URL to your production URL
3. Add your domain to Redirect URLs: `https://thecareerspot.com/auth/callback`
4. Customise email templates (optional) in Authentication > Email Templates

## Stripe Setup

1. Create products for Day Pass and Monthly Membership (or use dynamic pricing as configured)
2. Set up webhook endpoint: `https://thecareerspot.com/api/webhooks/stripe`
3. Subscribe to event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Resend (Email)

1. Sign up at resend.com
2. Add and verify your domain (`thecareerspot.com`)
3. Add required DNS records (SPF, DKIM, DMARC)
4. Copy API key to `RESEND_API_KEY`
5. Set `RESEND_FROM` to your verified sender address

## Domain & Deployment

1. Connect your domain to Vercel
2. Ensure SSL certificate is active
3. Set all environment variables in Vercel
4. Deploy and verify build passes

## Admin Account

1. Sign in with your email via magic link
2. In Supabase SQL Editor, set your account as admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. Verify `/admin` is accessible

## Smoke Tests

After deployment, verify each flow:

- [ ] Homepage loads correctly
- [ ] Magic link login works (check email delivery)
- [ ] Day pass booking flow: select date → pay → confirmation page
- [ ] Membership application form submits successfully
- [ ] Applicant receives confirmation email
- [ ] Admin receives notification email
- [ ] Admin can review, approve, and reject applications
- [ ] Payment link email sends to approved applicant
- [ ] QR check-in works (camera + manual entry)
- [ ] Member dashboard shows bookings and membership
- [ ] Capacity formula: `Available = 14 - Active Monthly - Day Passes Booked`
- [ ] Health check: `GET /api/health` returns `{ status: "healthy" }`

## Post-Launch

- Monitor Stripe webhook delivery in Stripe dashboard
- Monitor email delivery in Resend dashboard
- Review audit logs in Supabase: `SELECT * FROM audit_logs ORDER BY created_at DESC`
- Clean up expired rate limit records periodically
