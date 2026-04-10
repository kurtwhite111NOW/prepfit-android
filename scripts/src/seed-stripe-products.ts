import { getUncachableStripeClient } from './stripeClient';

async function createNutriPrepProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Creating NutriPrep Pro subscription in Stripe...');

    const existing = await stripe.products.search({ query: "name:'NutriPrep Pro' AND active:'true'" });
    if (existing.data.length > 0) {
      console.log('NutriPrep Pro already exists:', existing.data[0].id);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      for (const price of prices.data) {
        console.log(`  Price: ${price.id} — $${(price.unit_amount! / 100).toFixed(2)} / ${(price.recurring as any)?.interval}`);
      }
      return;
    }

    const product = await stripe.products.create({
      name: 'NutriPrep Pro',
      description: 'AI-powered meal prep planner for busy moms. Unlimited AI meal plans, photo calorie scanning, smart grocery lists, and weight tracking.',
    });
    console.log('Created product:', product.id);

    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 14400,
      currency: 'usd',
      recurring: { interval: 'year' },
      nickname: 'Annual Plan',
    });
    console.log('Created annual price:', yearlyPrice.id, '— $144.00/year');

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1200,
      currency: 'usd',
      recurring: { interval: 'month' },
      nickname: 'Monthly Plan',
    });
    console.log('Created monthly price:', monthlyPrice.id, '— $12.00/month');

    console.log('\nDone! Save these IDs:');
    console.log('  Annual price ID:', yearlyPrice.id);
    console.log('  Monthly price ID:', monthlyPrice.id);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createNutriPrepProducts();
