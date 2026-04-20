import { getUncachableStripeClient } from './stripeClient';

async function createPrepFitProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Setting up PrepFit Pro subscription in Stripe...');

    const existing = await stripe.products.search({ query: "name:'PrepFit Pro' AND active:'true'" });
    if (existing.data.length > 0) {
      console.log('PrepFit Pro already exists:', existing.data[0].id);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      for (const price of prices.data) {
        console.log(`  Price: ${price.id} — $${(price.unit_amount! / 100).toFixed(2)} / ${(price.recurring as any)?.interval}`);
      }
      return;
    }

    const product = await stripe.products.create({
      name: 'PrepFit Pro',
      description: 'AI-powered gym & fitness meal prep planner. Unlimited AI meal plans, photo calorie scanning, smart grocery lists, weight & water tracking.',
    });
    console.log('Created product:', product.id);

    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 16800,
      currency: 'usd',
      recurring: { interval: 'year' },
      nickname: 'Annual Plan — $168/year',
    });
    console.log('Created annual price:', yearlyPrice.id, '— $168.00/year');

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1400,
      currency: 'usd',
      recurring: { interval: 'month' },
      nickname: 'Monthly Plan — $14/month',
    });
    console.log('Created monthly price:', monthlyPrice.id, '— $14.00/month');

    console.log('\nDone! IDs:');
    console.log('  Annual price ID:', yearlyPrice.id);
    console.log('  Monthly price ID:', monthlyPrice.id);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createPrepFitProducts();
