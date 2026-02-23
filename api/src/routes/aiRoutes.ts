import { Router } from "express";
import { createInsult, rateInsult } from "#controllers";

export const aiRoutes = Router();

aiRoutes.route("/create-insult").post(createInsult);

aiRoutes.route("/rate-insult").post(rateInsult);
