export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonType {
  type: { name: string };
}

export interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
    front_default: string;
  };
  stats: PokemonStat[];
  types: PokemonType[];
  abilities: PokemonAbility[];
}

export const fetchPokemonList = async (
  limit = 24,
  offset = 0,
): Promise<{ results: PokemonListItem[]; count: number }> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );
  return res.json();
};

export const fetchPokemonDetail = async (
  nameOrId: string | number,
): Promise<PokemonDetail> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
  return res.json();
};

export const getTypeColor = (type: string): string => {
  const map: Record<string, string> = {
    fire: "bg-type-fire",
    water: "bg-type-water",
    grass: "bg-type-grass",
    electric: "bg-type-electric",
    psychic: "bg-type-psychic",
    ice: "bg-type-ice",
    dragon: "bg-type-dragon",
    dark: "bg-type-dark",
    fairy: "bg-type-fairy",
    fighting: "bg-type-fighting",
    flying: "bg-type-flying",
    poison: "bg-type-poison",
    ground: "bg-type-ground",
    rock: "bg-type-rock",
    bug: "bg-type-bug",
    ghost: "bg-type-ghost",
    steel: "bg-type-steel",
    normal: "bg-type-normal",
  };
  return map[type] || "bg-muted";
};

export const getArtwork = (pokemon: PokemonDetail): string => {
  return (
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default
  );
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pokemonId = 25;
export const pikachuImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
