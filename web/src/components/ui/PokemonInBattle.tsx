import type { PokemonDetail } from "@/lib/pokemon";
import { ChatBox } from "./ChatBox";
import type { Insult, GameState } from "@/types/index";
import { InsultBar } from "./InsultBar";

type PokemonInBattleProps = {
  pokemon: PokemonDetail;
  insultLevel: number;
  insults: Insult[];
  isPlayer: boolean;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setPlayerCreatedInsults: React.Dispatch<React.SetStateAction<Insult[]>>;
};

export const PokemonInBattle = ({
  pokemon,
  insultLevel,
  insults,
  isPlayer,
  gameState,
  setGameState,
  setPlayerCreatedInsults,
}: PokemonInBattleProps) => {
  return (
    <div className="">
      <div
        className={`battleInfoBox mt-4 bg-sidebar-accent w-full px-4 pt-2 pb-3 rounded-md`}
      >
        <div className={`basis-full`}>{pokemon.name}</div>
        <InsultBar value={insultLevel} />
      </div>
      <>
        <ChatBox
          messages={insults}
          isPlayer={isPlayer}
          gameState={gameState}
          setGameState={setGameState}
          setPlayerCreatedInsults={setPlayerCreatedInsults}
        ></ChatBox>
        <div className="flex justify-center absolute bottom-25 left-0 right-0">
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
