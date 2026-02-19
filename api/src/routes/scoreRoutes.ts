import { Router } from "express";
import { validateBody } from "#middleware";
import { authenticate } from "#middleware";
import { scoreCreate, scoreGetAll } from "#controllers";
import { scoreShema } from "#schema";

export const scoreRoutes = Router();

scoreRoutes
  .route("/")
  .post(authenticate, validateBody(scoreShema), scoreCreate)
  .get(authenticate, scoreGetAll);
