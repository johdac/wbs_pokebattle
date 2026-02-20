import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  fetchPokemonDetail,
  getArtwork,
  getTypeColor,
  capitalize,
} from "@/lib/pokemon";
import { StatBar } from "../layout/StatBar";
import { addToRoster, isInRoster } from "@/lib/store";
import { useState } from "react";

export const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [inRoster, setInRoster] = useState(() => isInRoster(Number(id)));

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemonDetail(id!),
    enabled: !!id,
  });

  const handleAdd = () => {
    if (!pokemon) return;
    const added = addToRoster(pokemon.id);
    if (added) setInRoster(true);
  };

  if (isLoading || !pokemon) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <i className="fa-solid fa-arrow-left"></i> Back to Pokédex
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center rounded-2xl border border-border bg-card p-8"
        >
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
            className="h-64 w-64 object-contain animate-float"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="font-display text-xs text-muted-foreground">
              #{String(pokemon.id).padStart(3, "0")}
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {capitalize(pokemon.name)}
            </h1>
            <div className="mt-2 flex gap-2">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className={`rounded-full px-3 py-1 text-xs font-bold text-foreground ${getTypeColor(type.name)}`}
                >
                  {capitalize(type.name)}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Height</span>
              <p className="font-bold text-foreground">
                {(pokemon.height / 10).toFixed(1)} m
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Weight</span>
              <p className="font-bold text-foreground">
                {(pokemon.weight / 10).toFixed(1)} kg
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-1 font-display text-sm font-semibold text-foreground">
              Abilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <span
                  key={ability.name}
                  className="rounded-lg border border-border bg-secondary px-3 py-1 text-xs text-foreground"
                >
                  {capitalize(ability.name)}
                  {is_hidden ? " (Hidden)" : ""}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-sm font-semibold text-foreground">
              Base Stats
            </h2>
            <div className="space-y-2">
              {pokemon.stats.map(({ stat, base_stat }) => (
                <StatBar key={stat.name} label={stat.name} value={base_stat} />
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={inRoster}
            className={`w-full ${inRoster ? "btn-added" : "btn-default"}`}
          >
            {inRoster ? (
              <>
                <i className="fa-solid fa-check mr-2"></i>
                In Roster
              </>
            ) : (
              <>
                <i className="fa-solid fa-plus mr-2"></i>
                Add to Roster
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
