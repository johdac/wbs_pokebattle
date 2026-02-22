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
  const [playerInsulted, setPlayerInsulted] = useState(100);
  const [opponentInsulted, setOpponentInsulted] = useState(100);
  const [playerCreatedInsults, setPlayerCreatedInsults] = useState<Insult[]>(
    [],
  );
  const [opponentCreatedInsults, setOpponentCreatedInsults] = useState<
    Insult[]
  >([]);

  // Get playerId from url params
  const { id: playerId } = useParams<{ id: string }>();

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

  useEffect(() => {
    if (!listData?.count) return;
    fetchRandomOpponent();
  }, [listData?.count]);

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
    console.log(data);
    setOpponentCreatedInsults((prev) => {
      return [...prev, data];
    });
    setGameState("ratingOpponentsInsult");
  };

  useEffect(() => {
    if (gameState !== "gettingOpponentsInsult") return;
    getInsult();
  }, [gameState]);

  const startGame = () => {
    setGameState("gettingOpponentsInsult");
  };

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
                    health={opponentInsulted}
                    insults={opponentCreatedInsults}
                    isPlayer={false}
                    gameState={gameState}
                  />
                </div>
                <div className="relative">
                  <PokemonInBattle
                    pokemon={playerPokemon}
                    health={playerInsulted}
                    insults={playerCreatedInsults}
                    isPlayer={true}
                    gameState={gameState}
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
