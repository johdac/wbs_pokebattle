import { Router } from "express";
import { userCreate, userGetAll } from "#controllers";
import { validateBody } from "#middleware";
import { userCreateRequestSchema } from "#schema";

export const userRoutes = Router();

userRoutes
  .route("/")
  .get(userGetAll)
  .post(validateBody(userCreateRequestSchema), userCreate);
