import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import groceryRouter from "./groceries";
import mealPlanRouter from "./mealplan";
import recipesRouter from "./recipes";
import budgetRouter from "./budget";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/profile", profileRouter);
router.use("/groceries", groceryRouter);
router.use("/mealplan", mealPlanRouter);
router.use("/recipes", recipesRouter);
router.use("/budget", budgetRouter);
router.use("/dashboard", dashboardRouter);
router.use("/admin", adminRouter);

export default router;
