import { useState } from "react";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

async function getAnnualPriceId(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/stripe/products`);
    const data = await res.json();
    for (const product of data.data || []) {
      if (product.name === 'PrepFit Pro') {
        const annual = product.prices?.find((p: any) => p.recurring?.interval === 'year');
        if (annual) return annual.id;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const priceId = await getAnnualPriceId();
      if (!priceId) {
        throw new Error('Subscription plan not found. Please try again.');
      }

      const res = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to start checkout');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return { startCheckout, loading, error };
}
