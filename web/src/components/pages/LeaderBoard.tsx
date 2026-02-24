import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { leaderboardService } from "@/services/score.service";

export const Leaderboard = () => {
  const { user } = useAuth();
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const data = await leaderboardService.getTopScores();
      return data.slice(0, 10);
    },
  });
  const rankStyles = [
    "border-yellow-400/50 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.1)]",
    "border-slate-400/50 bg-slate-400/5",
    "border-amber-600/50 bg-amber-600/5",
  ];

  if (isLoading)
    return <div className="text-center p-10">Loading Rankings...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Global rankings</p>
      </div>

      <div className="mx-auto mt-8 max-w-lg space-y-3">
        {leaderboard.map((entry, i) => {
          const isMe = entry.userId.id === user?._id;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                isMe
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              } ${i < 3 ? rankStyles[i] : "border-border bg-card"}`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-foreground">
                {i < 3 ? (
                  <Medal
                    className={`h-6 w-6 ${
                      i === 0
                        ? "text-yellow-400"
                        : i === 1
                          ? "text-slate-400"
                          : "text-amber-600"
                    }`}
                  />
                ) : (
                  i + 1
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`font-display text-sm font-semibold ${isMe ? "text-primary" : "text-foreground"}`}
                >
                  {entry.userId.username} {isMe && "(You)"}
                </p>
              </div>

              <p className="font-display text-lg font-bold text-primary">
                {entry.score.toLocaleString()}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
