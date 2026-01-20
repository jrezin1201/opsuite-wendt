# Setup Guide - Web App Template

Complete step-by-step guide to get your app running locally and deploy to production.

## Prerequisites

- Node.js 18+ installed
- Git installed
- A GitHub account (for deployment)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd web-app-template
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

You'll need to set up the following services and add their credentials to `.env.local`:

### 3. Database Setup (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
   ```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if prompted
6. For Application type, select "Web application"
7. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
8. Copy Client ID and Client Secret to `.env.local`:
   ```
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 5. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API keys
3. **Important**: Use test mode keys for development
4. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   ```

#### Create a Product and Price

1. In Stripe Dashboard, go to Products
2. Create a new product (e.g., "Pro Subscription")
3. Add a recurring price (e.g., $10/month)
4. Copy the Price ID (starts with `price_`)
5. Add to `.env.local`:
   ```
   STRIPE_PRICE_ID_PRO_MONTHLY="price_..."
   ```

#### Set up Webhooks (Local Development)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### 6. NextAuth Secret

Generate a secret key for NextAuth:

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 7. App URL

Set the public app URL:

```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 8. Initialize Database

Run Prisma migrations to create database tables:

```bash
npm run db:migrate
```

This will prompt you to name the migration (e.g., "init").

### 9. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Important**: Keep the Stripe CLI webhook listener running in a separate terminal during development.

## Testing Authentication

1. Click "Sign In" on the homepage
2. Sign in with your Google account
3. You should be redirected back to the app as an authenticated user

## Testing Payments

1. Sign in with Google
2. Go to Account → Upgrade to Pro
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future expiry date and any CVC
5. Check that:
   - Stripe webhook fires in CLI
   - User is upgraded to Pro in database
   - UI shows Pro badge

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will detect Next.js automatically
4. Add environment variables (same as `.env.local` but with production values):
   - `DATABASE_URL` - Your Neon production connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://myapp.vercel.app`)
   - `NEXTAUTH_SECRET` - Same secret from development
   - `GOOGLE_CLIENT_ID` - Same (or create new prod credentials)
   - `GOOGLE_CLIENT_SECRET` - Same (or create new prod credentials)
   - `STRIPE_SECRET_KEY` - **Production** key from Stripe (`sk_live_...`)
   - `STRIPE_PRICE_ID_PRO_MONTHLY` - Production Price ID
   - `STRIPE_WEBHOOK_SECRET` - From production webhook (see below)
   - `NEXT_PUBLIC_APP_URL` - Your production URL

5. Deploy!

### 3. Configure Production Webhooks

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret and add to Vercel environment variables
5. Redeploy for changes to take effect

### 4. Update OAuth Redirect URIs

1. Go back to Google Cloud Console
2. Add your production URL to authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`

## Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Create a new migration
npm run db:migrate

# Deploy migrations (production)
npm run db:deploy

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (⚠️ deletes all data)
npm run db:reset
```

## Troubleshooting

### "Failed to execute 'json' on 'Response'"

- NextAuth can't initialize
- Check that all environment variables are set
- Verify Google OAuth credentials are correct

### Stripe Webhooks Not Working

- Make sure Stripe CLI is running (`stripe listen...`)
- Check webhook secret matches your `.env.local`
- Verify endpoint URL is correct

### Database Connection Errors

- Check DATABASE_URL is correct
- Verify Neon project is active
- Run `npm run db:migrate` to ensure schema is up to date

### "Module not found" Errors

- Run `npm install` to ensure all dependencies are installed
- Try deleting `node_modules` and `.next`, then reinstall

## Next Steps

- Customize branding in `src/app/layout.tsx`
- Modify color scheme in `tailwind.config.ts`
- Add your own features!
- Check out the component library in `src/components/ui/`

## Support

For issues or questions:
- Check the [README.md](README.md)
- Open an issue on GitHub
- Review Next.js, NextAuth, Prisma, and Stripe documentation
