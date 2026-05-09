import { Router, type IRouter } from 'express';
import { stripeStorage } from '../stripeStorage';
import { getUncachableStripeClient, getStripePublishableKey } from '../stripeClient';
import { logger } from '../lib/logger';

const router: IRouter = Router();

router.get('/stripe/config', async (_req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err: any) {
    logger.error({ err }, 'Failed to get Stripe config');
    res.status(500).json({ error: 'Failed to load Stripe configuration' });
  }
});

router.get('/stripe/products', async (_req, res) => {
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
      return res.json({ data: Array.from(productsMap.values()) });
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

router.post('/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, email } = req.body as { priceId: string; userId?: string; email?: string };

    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
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
      success_url: `${baseUrl}/?checkout=success`,
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

router.post('/stripe/portal-by-email', async (req, res) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const stripe = await getUncachableStripeClient();
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (!customers.data.length) {
      return res.status(404).json({ error: 'No subscription found for that email address.' });
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

router.post('/stripe/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body as { customerId: string };
    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' });
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
