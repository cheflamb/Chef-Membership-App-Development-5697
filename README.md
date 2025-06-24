# Stripe Webhooks Setup Guide

## 1. Create Stripe Price IDs

In your Stripe dashboard, create products and prices:

### Brigade Membership
- Product: "Brigade Membership"  
- Price: $19/month recurring
- Price ID: `price_brigade_monthly` (use this in the code)

### Fraternity Membership  
- Product: "Fraternity Membership"
- Price: $97/month recurring  
- Price ID: `price_fraternity_monthly`

### Guild Membership
- Product: "Guild Membership"
- Price: $497/month recurring
- Price ID: `price_guild_monthly`

## 2. Set Up Webhook Endpoint

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded` 
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. Copy the webhook signing secret to your `.env` file

## 3. Environment Variables

Create a `.env.local` file with:

```env
# Supabase
SUPABASE_URL=https://htuggbwptckrmlhbrvng.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe  
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 4. Deploy API Routes

If using Vercel/Netlify, make sure these files are deployed:
- `/api/webhooks/stripe.js`
- `/api/create-checkout-session.js` 
- `/api/create-billing-portal-session.js`

## 5. Test the Flow

1. User signs up for free account
2. User clicks "Upgrade" on pricing page
3. Completes Stripe checkout
4. Webhook automatically upgrades their tier
5. User gets welcome notification and tier benefits

## 6. Subscription Management

Users can manage their subscription via the billing portal:
- Update payment method
- Cancel subscription  
- Download receipts
- View billing history

The webhook handles all tier changes automatically.