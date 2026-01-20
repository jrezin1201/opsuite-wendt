import Stripe from "stripe";

let _stripe: Stripe | null = null;

const getStripe = () => {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  _stripe = new Stripe(key, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
  });

  return _stripe;
};

export const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => {
    const stripeInstance = getStripe();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (stripeInstance as any)[prop];
  },
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID_PRO_MONTHLY || "";
