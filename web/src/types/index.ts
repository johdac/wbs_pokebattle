export type Insult = {
  insult: string;
};

export type GameState =
  | "loadingOpponent"
  | "readyToStart"
  | "gettingOpponentsInsult"
  | "ratingOpponentsInsult"
  | "gettingPlayersInsult"
  | "ratingPlayersInsult";
