import type { LeaderboardEntry } from "@/types";
import { gameApi } from "./gameApi";

export const leaderboardService = {
  getTopScores: async () => {
    const { data } = await gameApi.get<LeaderboardEntry[]>("/scores");
    return data.sort((a, b) => b.score - a.score);
  },
};
