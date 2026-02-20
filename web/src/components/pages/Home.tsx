import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { fetchPokemonList, fetchPokemonDetail } from "@/lib/pokemon";
import { Card } from "@/components/layout/Card";

const PAGE_SIZE = 24;

export const Home = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data: listData } = useQuery({
    queryKey: ["pokemon-list", page],
    queryFn: () => fetchPokemonList(PAGE_SIZE, page * PAGE_SIZE),
  });

  const { data: pokemonDetails, isLoading } = useQuery({
    queryKey: ["pokemon-details", page],
    queryFn: async () => {
      if (!listData) return [];
      const details = await Promise.all(
        listData.results.map((p) => fetchPokemonDetail(p.name)),
      );
      return details;
    },
    enabled: !!listData,
  });

  const filtered = pokemonDetails?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{
              opacity: 0,
              filter:
                "brightness(50%) drop-shadow(0px 0px 0px hsl(48 96% 53% / 0))",
            }}
            animate={{
              // Pulse opacity for that "flickering neon" feel
              opacity: [0.7, 1, 0.8, 1],
              filter: [
                "brightness(100%) drop-shadow(0px 0px 2px hsl(48 96% 53% / 0.3))",
                "brightness(130%) drop-shadow(0px 0px 15px hsl(48 96% 53% / 0.8))",
                "brightness(100%) drop-shadow(0px 0px 2px hsl(48 96% 53% / 0.3))",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="font-display text-4xl font-bold text-gradient-primary sm:text-5xl"
          >
            PokéBattle Arena
          </motion.h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Collect Pokémon, build your roster, and battle your way to the top
            of the leaderboard.
          </p>

          <div className="mx-auto mt-6 flex max-w-sm items-center gap-2">
            <div className="bg-secondary border border-border flex items-center px-4 py-2 rounded-lg w-full transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <i className="fa-solid fa-magnifying-glass text-muted-foreground mr-3"></i>
              <input
                placeholder="Search Pokémon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}

      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"></div>
      </section>
      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filtered?.map((pokemon, i) => (
                <Card key={pokemon.id} pokemon={pokemon} index={i} />
              ))}
            </div>
            {!search && (
              <div className="mt-8 flex justify-center gap-3">
                <button
                  // variant="outline"
                  className="cursor-pointer"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span className="flex items-center text-sm text-muted-foreground cursor-pointer">
                  Page {page + 1}
                </span>
                <button
                  className="cursor-pointer"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={
                    !listData || (page + 1) * PAGE_SIZE >= listData.count
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
