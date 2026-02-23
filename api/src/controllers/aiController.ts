import { Agent, run, tool } from "@openai/agents";
import type { RequestHandler } from "express";
import z from "zod";

const insultAgent = new Agent({
  name: "insultAgent",
  instructions: `You are a pokemon in a battle with another pokemon. However you only fight through insulting
  (burning) the other pokemon in a funny way. Reply with only your insult, do not describe or write anything else`,
});

const ratingAgent = new Agent({
  name: "ratingAgent",
  instructions: `
    You are a strict judge in a Pokemon insult battle.

    You will receive:
    - The attacking Pokemon
    - The defending Pokemon
    - The insult that was said

    Your task:
    Evaluate the insult from 0 to 30 based on:
    - Creativity
    - Humor
    - How well it fits the opponent Pokemon
    - How strong the burn is
    The rating must be an integer between 0 and 30.
    The better the insult the higher the score.

    Do not respond with text.
    Respond ONLY with the rating number.`,
});

export const createInsult: RequestHandler = async (req, res) => {
  const { playerPokemon, opponentPokemon } = req.body;
  const result = await run(
    insultAgent,
    `You are pokemon ${opponentPokemon} fighting against ${playerPokemon}. Create a funny insult about ${playerPokemon}`,
  );
  res.json({ insult: result.finalOutput });
};

export const rateInsult: RequestHandler = async (req, res) => {
  const { actor, receiver, insult } = req.body;
  const result = await run(
    ratingAgent,
    `
      Attacker: ${actor}
      Defender: ${receiver}
      Insult: ${insult}
    `,
  );

  res.json(result.finalOutput);
};
