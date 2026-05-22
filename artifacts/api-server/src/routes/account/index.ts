import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, mealPlansTable, savedMealsTable, weightEntriesTable } from "@workspace/db";
import { clerkClient } from "@clerk/express";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

router.delete("/account", async (req: any, res): Promise<void> => {
  const userId: string = req.userId;

  try {
    await db.delete(mealPlansTable).where(eq(mealPlansTable.userId, userId));
    await db.delete(savedMealsTable).where(eq(savedMealsTable.userId, userId));
    await db.delete(weightEntriesTable).where(eq(weightEntriesTable.userId, userId));

    await clerkClient.users.deleteUser(userId);

    res.status(200).json({ deleted: true });
  } catch (err: any) {
    logger.error({ err, userId }, "Failed to delete account");
    res.status(500).json({ error: "Failed to delete account. Please try again." });
  }
});

export default router;
