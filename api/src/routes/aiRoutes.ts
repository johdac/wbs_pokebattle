import { Router } from "express";
import { createInsult, rateInsult } from "#controllers";
import { authenticate, validateBody } from "#middleware";
import { aiCreateInsultSchema, aiRateInsultSchema } from "#schema";

export const aiRoutes = Router();

aiRoutes
  .route("/create-insult")
  .post(authenticate, validateBody(aiCreateInsultSchema), createInsult);

aiRoutes
  .route("/rate-insult")
  .post(authenticate, validateBody(aiRateInsultSchema), rateInsult);
