# PUNCH STUDIO: hosting and login setup

The site is one static page (`index.html`). `npm run build` copies it to `dist` and puts your public Supabase values into it. The build refuses to run if the key is a secret/service-role key. Nothing here is deployed yet.

## 1. Create the Supabase project (free tier)
1. supabase.com, sign up, New project. Pick a region and a database password (keep it private; the site never uses it).
2. Copy the **Project URL** (looks like `https://abcdxyz.supabase.co`, no `/rest/v1/` on the end; the build trims it if you paste the Data API address) and a **publishable** key (`sb_publishable_...`), or the legacy anon key. Never copy a `secret` or `service_role` key. In Cloudflare, the publishable key goes in the variable named `VITE_SUPABASE_ANON_KEY`.
3. SQL Editor, New query: paste `supabase.sql`, Run. This creates the `profiles` table with Row Level Security (users can only read and change their own row).

## 2. Email login and verification
Authentication, Sign In / Providers: Email is on by default; keep "Confirm email" on. Authentication, URL Configuration:
- Site URL: your live address, e.g. `https://punch-studio.pages.dev`
- Redirect URLs (add all): `https://punch-studio.pages.dev/`, `http://localhost:3000/`
Supabase's built-in email sender is rate-limited and meant for testing. For real customers, add your own SMTP under Authentication, SMTP settings.

## 3. Google login
1. console.cloud.google.com, new project, APIs & Services, OAuth consent screen (External), then Credentials, Create OAuth client ID, type Web application.
2. Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. In Supabase, Authentication, Providers, Google: paste Client ID and Client Secret, enable, Save. The secret stays in Supabase only.

## 4. Apple and Microsoft (not set up, not tested)
- **Apple:** Apple Developer Program (paid), an App ID, a Services ID (the Client ID) with Sign in with Apple enabled, domain `<ref>.supabase.co`, return URL `https://<ref>.supabase.co/auth/v1/callback`, a Sign in with Apple key (.p8), Team ID and Key ID. Supabase needs a client secret generated from the key, and Apple secrets expire (about every 6 months).
- **Microsoft (Azure):** Azure portal, App registrations, New registration, redirect URI (Web) `https://<ref>.supabase.co/auth/v1/callback`; copy the Application (client) ID; create a client secret under Certificates & secrets. In Supabase, Providers, Azure: paste ID, secret and your tenant URL.

## 5. Phone login (not set up, not tested)
Supabase, Authentication, Providers, Phone: enable and connect an SMS provider (Twilio, MessageBird, Vonage or TextLocal) with its own account and credentials. SMS costs money and is not part of the free tier. Until then the site shows an error and never claims a code was sent.

## 6. Publish free on Cloudflare Pages (Android-friendly)
1. Make free GitHub and Cloudflare accounts. In Chrome, use "Desktop site" if a page looks cramped.
2. GitHub: New repository `punch-studio`, Public. Add file, Upload files, select every file in this folder (not `.env`), Commit.
3. Cloudflare: Workers & Pages, Create, Pages, Connect to Git, pick the repo. (Menu names change.)
4. Build command `npm run build`, output directory `dist`.
5. Under Environment variables add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public values only). Save and Deploy.
6. Open your `https://<name>.pages.dev` address. Replace `YOUR-PROJECT.pages.dev` in `robots.txt` and `sitemap.xml`.
7. Go back to Supabase URL Configuration and make sure your real address is in Site URL and Redirect URLs.
Changing environment variables needs a new deploy (Deployments, Retry, or commit any change).

## Local development
`cp .env.example .env`, fill in the two values, then run them into the build, e.g. `export $(cat .env | xargs) && npm run dev`, and open http://localhost:3000.

## Still to set before launch
`waCountryCode` and business hours in `index.html` (`const CFG`).
