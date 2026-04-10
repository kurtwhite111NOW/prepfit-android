import { db } from '@workspace/db';
import { usersTable } from '@workspace/db';
import { eq, sql } from 'drizzle-orm';

export class StripeStorage {
  async getUser(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user || null;
  }

  async upsertUser(id: string, email?: string) {
    const [user] = await db
      .insert(usersTable)
      .values({ id, email })
      .onConflictDoUpdate({ target: usersTable.id, set: { email } })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, info: { stripeCustomerId?: string; stripeSubscriptionId?: string }) {
    const [user] = await db.update(usersTable).set(info).where(eq(usersTable.id, userId)).returning();
    return user;
  }

  async getProduct(productId: string) {
    const result = await db.execute(sql`SELECT * FROM stripe.products WHERE id = ${productId}`);
    return result.rows[0] || null;
  }

  async listProductsWithPrices() {
    const result = await db.execute(sql`
      SELECT
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.active as product_active,
        pr.id as price_id,
        pr.unit_amount,
        pr.currency,
        pr.recurring,
        pr.active as price_active
      FROM stripe.products p
      LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
      WHERE p.active = true
      ORDER BY p.id, pr.unit_amount
    `);
    return result.rows;
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`);
    return result.rows[0] || null;
  }

  async getActiveSubscriptionForCustomer(customerId: string) {
    const result = await db.execute(sql`
      SELECT * FROM stripe.subscriptions
      WHERE customer = ${customerId}
      AND status IN ('active', 'trialing')
      ORDER BY created DESC
      LIMIT 1
    `);
    return result.rows[0] || null;
  }
}

export const stripeStorage = new StripeStorage();
