import z from "zod";
import { mongoId } from "./rules.ts";

export const scoreShema = z.strictObject({
  userId: mongoId,
  score: z.number().int({ message: "A score value is required" }),
  date: z.iso.datetime().optional(),
});
export type Score = z.infer<typeof scoreShema>;
