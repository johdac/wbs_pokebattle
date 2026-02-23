import z from "zod";

export const aiCreateInsultSchema = z.strictObject({
  playerPokemon: z.string(),
  opponentPokemon: z.string(),
});
export type aiCreateInsult = z.infer<typeof aiCreateInsultSchema>;

export const aiRateInsultSchema = z.strictObject({
  actor: z.string(),
  receiver: z.string(),
  insult: z.string(),
});
export type aiRateInsult = z.infer<typeof aiRateInsultSchema>;
