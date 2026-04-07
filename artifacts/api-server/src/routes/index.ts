import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mealPlansRouter from "./meal-plans";
import savedMealsRouter from "./saved-meals";
import shoppingListsRouter from "./shopping-lists";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mealPlansRouter);
router.use(savedMealsRouter);
router.use(shoppingListsRouter);
router.use(aiRouter);

export default router;
