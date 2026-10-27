import { Router, type IRouter } from 'express';
import { stripeStorage } from '../stripeStorage';
import { getUncachableStripeClient, getStripePublishableKey } from '../stripeClient';
import { logger } from '../lib/logger';

const router: IRouter = Router();

router.get('/stripe/config', async (_req, res): Promise<void> => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err: any) {
    logger.error({ err }, 'Failed to get Stripe config');
    res.status(500).json({ error: 'Failed to load Stripe configuration' });
  }
});

router.get('/stripe/products', async (_req, res): Promise<void> => {
  try {
    const rows = await stripeStorage.listProductsWithPrices();

    if (rows.length > 0) {
      const productsMap = new Map<string, any>();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }
      res.json({ data: Array.from(productsMap.values()) });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true }),
      stripe.prices.list({ active: true }),
    ]);

    const productsMap = new Map<string, any>();
    for (const product of products.data) {
      productsMap.set(product.id, {
        id: product.id,
        name: product.name,
        description: product.description,
        prices: [],
      });
    }
    for (const price of prices.data) {
      const product = productsMap.get(price.product as string);
      if (product) {
        product.prices.push({
          id: price.id,
          unit_amount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring,
        });
      }
    }
    res.json({ data: Array.from(productsMap.values()) });
  } catch (err: any) {
    logger.error({ err }, 'Failed to list products');
    res.status(500).json({ error: 'Failed to load products' });
  }
});

router.get('/stripe/verify-session', async (req, res): Promise<void> => {
  const { session_id } = req.query;
  if (!session_id || typeof session_id !== 'string') {
    res.status(400).json({ error: 'session_id is required' });
    return;
  }
  try {
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const active =
      session.status === 'complete' &&
      session.subscription != null;
    res.json({ active, customerId: session.customer || null });
  } catch (err: any) {
    logger.error({ err }, 'Failed to verify session');
    res.status(500).json({ error: 'Failed to verify session' });
  }
});

router.get('/stripe/check-subscription', async (req: any, res): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId || userId === 'demo-user') {
      res.json({ active: false });
      return;
    }

    // Check via stored Stripe customer ID first (fast path)
    const user = await stripeStorage.getUser(userId);
    if (user?.stripeCustomerId) {
      const sub = await stripeStorage.getActiveSubscriptionForCustomer(user.stripeCustomerId);
      if (sub) {
        res.json({ active: true });
        return;
      }
    }

    // Fallback: look up by email in Stripe directly
    const { clerkClient } = await import('@clerk/express');
    const stripe = await getUncachableStripeClient();
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;

    if (email) {
      const customers = await stripe.customers.list({ email, limit: 5 });
      for (const customer of customers.data) {
        const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 1 } as any);
        if (subs.data.length > 0) {
          res.json({ active: true });
          return;
        }
      }
    }

    res.json({ active: false });
  } catch (err: any) {
    logger.error({ err }, 'Failed to check subscription');
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

router.post('/stripe/create-checkout-session', async (req, res): Promise<void> => {
  try {
    const { priceId, userId, email } = req.body as { priceId: string; userId?: string; email?: string };

    if (!priceId) {
      res.status(400).json({ error: 'priceId is required' });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

    let customerId: string | undefined;

    if (userId) {
      let user = await stripeStorage.getUser(userId);
      if (!user) {
        user = await stripeStorage.upsertUser(userId, email);
      }
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: email || undefined,
          metadata: { userId },
        });
        user = await stripeStorage.updateUserStripeInfo(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      } else {
        customerId = user.stripeCustomerId;
      }
    }

    const sessionParams: any = {
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      allow_promotion_codes: true,
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err: any) {
    logger.error({ err }, 'Failed to create checkout session');
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/stripe/portal-by-email', async (req, res): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      res.status(400).json({ error: 'email is required' });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (!customers.data.length) {
      res.status(404).json({ error: 'No subscription found for that email address.' });
      return;
    }

    const customerId = customers.data[0].id;
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: baseUrl,
    });

    res.json({ url: portalSession.url });
  } catch (err: any) {
    logger.error({ err }, 'Failed to create portal session by email');
    res.status(500).json({ error: 'Failed to open billing portal. Please try again.' });
  }
});

router.post('/stripe/create-portal-session', async (req, res): Promise<void> => {
  try {
    const { customerId } = req.body as { customerId: string };
    if (!customerId) {
      res.status(400).json({ error: 'customerId is required' });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: baseUrl,
    });

    res.json({ url: portalSession.url });
  } catch (err: any) {
    logger.error({ err }, 'Failed to create portal session');
    res.status(500).json({ error: 'Failed to create customer portal session' });
  }
});

export default router;
