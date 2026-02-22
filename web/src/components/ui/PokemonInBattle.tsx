import type { PokemonDetail } from "@/lib/pokemon";
import { ChatBox } from "./Chatbox";
import type { Insult } from "@/types";
import { HealthBar } from "./HealthBar";
import type { GameState } from "@/types";

type PokemonInBattleProps = {
  pokemon: PokemonDetail;
  health: number;
  insults: Insult[];
  isPlayer: boolean;
  gameState: GameState;
};

export const PokemonInBattle = ({
  pokemon,
  health,
  insults,
  isPlayer,
  gameState,
}: PokemonInBattleProps) => {
  return (
    <div className="">
      <div
        className={`battleInfoBox w-56 mt-4 bg-sidebar-accent w-full px-4 pt-2 pb-3 rounded-md`}
      >
        <div className={`basis-full`}>{pokemon.name}</div>
        <HealthBar value={health} />
      </div>
      <>
        <ChatBox
          messages={insults}
          isPlayer={isPlayer}
          gameState={gameState}
        ></ChatBox>
        <div className="flex justify-center absolute bottom-15 left-0 right-0">
          <div className={`flex items-end justify-center`}>
            <img
              className={`pokemon ${!isPlayer && "scale-x-[-1]"}`}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`}
            ></img>
          </div>
        </div>
      </>
    </div>
  );
};
