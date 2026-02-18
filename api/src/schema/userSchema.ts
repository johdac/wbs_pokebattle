import z from "zod/v4";
import { string64, email, password } from "./rules.ts";

const userBaseSchema = z.strictObject({
  username: string64,
  email: email,
});
export type UserBaseDto = z.infer<typeof userBaseSchema>;

export const userCreateRequestSchema = userBaseSchema.extend({
  password: password,
});
export type UserCreateRequestDto = z.infer<typeof userCreateRequestSchema>;

export const userCreateResponseSchema = userBaseSchema.extend({
  id: z.string(),
});
export type UserCreateResponseDto = z.infer<typeof userCreateResponseSchema>;
