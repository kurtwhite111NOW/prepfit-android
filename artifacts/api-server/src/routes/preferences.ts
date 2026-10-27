import { Router, type IRouter } from 'express';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();

router.get('/preferences', async (req: any, res): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    res.json({
      allergies: user?.allergies ?? [],
      highProteinMode: user?.highProteinMode ?? false,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load preferences' });
  }
});

router.patch('/preferences', async (req: any, res): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { allergies, highProteinMode } = req.body as { allergies: string[]; highProteinMode: boolean };
  try {
    const [user] = await db
      .insert(usersTable)
      .values({ id: userId, allergies, highProteinMode })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: { allergies, highProteinMode },
      })
      .returning();
    res.json({
      allergies: user.allergies ?? [],
      highProteinMode: user.highProteinMode ?? false,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

export default router;
