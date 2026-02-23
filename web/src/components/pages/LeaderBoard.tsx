import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { getLeaderboard } from "@/lib/store";

export const Leaderboard = () => {
  const leaderboard = getLeaderboard();

  const rankStyles = [
    "border-primary text-primary",
    "border-accent text-accent",
    "border-type-fire text-type-fire",
  ];

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
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-4 rounded-xl border bg-card p-4 ${
              i < 3 ? rankStyles[i] : "border-border"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-foreground">
              {i < 3 ? (
                <Medal
                  className={`h-8 w-8 ${
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
              <p className="font-display text-sm font-semibold text-foreground">
                {entry.name}
              </p>
            </div>
            <p className="font-display text-lg font-bold text-primary">
              {entry.score}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
