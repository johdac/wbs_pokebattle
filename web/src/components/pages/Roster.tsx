import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  fetchPokemonDetail,
  getArtwork,
  getTypeColor,
  capitalize,
} from "@/lib/pokemon";
import { getRoster, removeFromRoster } from "@/lib/store";
import { Link } from "react-router";
import { useState } from "react";

export const Roster = () => {
  const [rosterIds, setRosterIds] = useState(getRoster);

  const { data: roster, isLoading } = useQuery({
    queryKey: ["roster-pokemon", rosterIds],
    queryFn: () => Promise.all(rosterIds.map((id) => fetchPokemonDetail(id))),
    enabled: rosterIds.length > 0,
  });

  const handleRemove = (id: number) => {
    removeFromRoster(id);
    setRosterIds(getRoster());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground">
        My Roster
      </h1>
      {rosterIds.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Your roster is empty.</p>
          <Link to="/">
            <button className="mt-4">Browse Pokémon</button>
          </Link>
        </div>
      ) : isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {rosterIds.map((_, i) => (
            <div
              key={i}
              className="h-60 animate-pulse rounded-xl bg-secondary"
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {roster?.map((pokemon, i) => (
            <motion.div
              key={pokemon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
            >
              <Link to={`/pokemon/${pokemon.id}`}>
                <div className="flex justify-center py-4">
                  <motion.img
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    src={getArtwork(pokemon)}
                    alt={pokemon.name}
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <h3 className="text-center font-display text-sm font-semibold text-foreground">
                  {capitalize(pokemon.name)}
                </h3>
                <div className="mt-2 flex justify-center gap-1">
                  {pokemon.types.map(({ type }) => (
                    <span
                      key={type.name}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-foreground ${getTypeColor(type.name)}`}
                    >
                      {capitalize(type.name)}
                    </span>
                  ))}
                </div>
              </Link>
              <button
                className="absolute cursor-pointer right-2 top-2 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(pokemon.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
