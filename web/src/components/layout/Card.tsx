import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  type PokemonDetail,
  getArtwork,
  getTypeColor,
  capitalize,
} from "@/lib/pokemon";

type PokemonCardProps = {
  pokemon: PokemonDetail;
  index?: number;
};

const Card = ({ pokemon, index = 0 }: PokemonCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/pokemon/${pokemon.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:glow-primary">
          <div className="absolute right-2 top-2 font-display text-xs text-muted-foreground">
            #{String(pokemon.id).padStart(3, "0")}
          </div>
          <div className="flex justify-center py-4">
            <img
              src={getArtwork(pokemon)}
              alt={pokemon.name}
              className="h-28 w-28 object-contain transition-transform group-hover:scale-110"
              loading="lazy"
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
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
