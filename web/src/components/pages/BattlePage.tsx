import {
  fetchPokemonDetail,
  fetchPokemonList,
  type PokemonDetail,
} from "@/lib/pokemon";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Insult, GameState } from "@/types";
import { PokemonInBattle } from "../ui/PokemonInBattle";

export const BattlePage = () => {
  const [gameState, setGameState] = useState<GameState>("loadingOpponent");
  const [opponentPokemon, setOpponentPokemon] = useState<PokemonDetail | null>(
    null,
  );
  const [playerInsultLevel, setPlayerInsultLevel] = useState<number>(0);
  const [opponentInsultLevel, setOpponentInsultLevel] = useState<number>(0);
  const [playerCreatedInsults, setPlayerCreatedInsults] = useState<Insult[]>(
    [],
  );
  const [opponentCreatedInsults, setOpponentCreatedInsults] = useState<
    Insult[]
  >([]);
  const { id: playerId } = useParams<{ id: string }>(); // Get playerId from url params

  // Request data from pokemon api to get the total count of pokemon
  const { data: listData } = useQuery({
    queryKey: ["pokemon-count"],
    queryFn: () => fetchPokemonList(1, 0),
  });

  // Get data for playerPokemon
  const { data: playerPokemon } = useQuery({
    queryKey: ["playerPokemon", playerId],
    queryFn: () => fetchPokemonDetail(playerId!),
    enabled: !!playerId,
  });

  // Get data for opponentPokemon. Using fetch to be able to retry on 404
  const fetchRandomOpponent = async () => {
    if (!listData?.count) return;

    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      // Create random id from the total number of pokemon as per api data
      const randomId = Math.floor(Math.random() * listData.count) + 1;

      // Get the pokemon of the random id
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

      // If that pokemon does not exist try again
      if (res.status === 404) {
        attempts++;
        continue;
      }

      // For real errors stop the loop
      if (!res.ok) break;

      // Store the data for the pokemon
      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOpponentPokemon(data);
      break;
    }
    setGameState("readyToStart");
  };

  const getInsult = async () => {
    const res = await fetch(`http://localhost:3000/ai/create-insult/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify({
        playerPokemon: `${playerPokemon?.name}`,
        opponentPokemon: `${opponentPokemon?.name}`,
      }),
    });
    if (!res.ok) throw new Error("Connection to API failed");
    const data = await res.json();
    setOpponentCreatedInsults((prev) => {
      return [...prev, data];
    });
    setGameState("ratingOpponentsInsult");
  };

  const rateInsult = async (
    actor: string,
    receiver: string,
    insult: string,
  ) => {
    const res = await fetch(`http://localhost:3000/ai/rate-insult/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify({
        actor: actor,
        receiver: receiver,
        insult: insult,
      }),
    });
    if (!res.ok) throw new Error("Connection to API failed");
    const data = await res.json();
    return data;
  };

  const startGame = () => {
    setGameState("gettingOpponentsInsult");
  };

  useEffect(() => {
    if (playerInsultLevel >= 100 || opponentInsultLevel >= 100) {
      setGameState("gameOver");
    } else if (gameState === "loadingOpponent" && listData?.count) {
      fetchRandomOpponent();
    } else if (gameState === "gettingOpponentsInsult") {
      getInsult();
    } else if (gameState === "ratingOpponentsInsult") {
      const rate = async () => {
        const insultDamage = await rateInsult(
          opponentPokemon?.name!,
          playerPokemon?.name!,
          opponentCreatedInsults[opponentCreatedInsults.length - 1].insult,
        );
        setPlayerInsultLevel((prev) => prev + Number(insultDamage));
        setGameState("gettingPlayersInsult");
      };
      rate();
    } else if (gameState === "ratingPlayersInsult") {
      const rate = async () => {
        const insultDamage = await rateInsult(
          playerPokemon?.name!,
          opponentPokemon?.name!,
          playerCreatedInsults[playerCreatedInsults.length - 1].insult,
        );
        setOpponentInsultLevel((prev) => prev + Number(insultDamage));
        setGameState("gettingOpponentsInsult");
      };
      rate();
    }
    console.log(gameState);
  }, [gameState, listData?.count]);

  return (
    <>
      {
        <div className="container mx-auto px-4 py-8">
          <div className="relative w-full rounded-md overflow-hidden">
            <img src="/img/bg1.png" alt="" />
            {gameState === "loadingOpponent" && (
              <div className="absolute top-1/2 left-1/2 -ml-50">
                <img src="/img/loading.png" className="w-100 " alt="" />
              </div>
            )}
            {gameState === "gameOver" && (
              <div className="absolute top-1/2 left-1/2 -ml-50 z-50">
                <img src="/img/gameover.png" className="w-100 " alt="" />
              </div>
            )}
            {gameState === "readyToStart" && (
              <div
                className="absolute top-1/2 left-1/2 -ml-25 cursor-pointer z-20"
                onClick={startGame}
              >
                <img src="/img/start.png" className="w-50" alt="" />
              </div>
            )}
            {playerPokemon && opponentPokemon && (
              <div className="absolute h-full top-0 flex gap-20  justify-center w-full z-10">
                <div className="relative">
                  <PokemonInBattle
                    pokemon={opponentPokemon}
                    insultLevel={opponentInsultLevel}
                    insults={opponentCreatedInsults}
                    isPlayer={false}
                    gameState={gameState}
                    setGameState={setGameState}
                    setPlayerCreatedInsults={setPlayerCreatedInsults}
                  />
                </div>
                <div className="relative">
                  <PokemonInBattle
                    pokemon={playerPokemon}
                    insultLevel={playerInsultLevel}
                    insults={playerCreatedInsults}
                    isPlayer={true}
                    gameState={gameState}
                    setGameState={setGameState}
                    setPlayerCreatedInsults={setPlayerCreatedInsults}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
};
