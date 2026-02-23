import {
  fetchPokemonDetail,
  fetchPokemonList,
  type PokemonDetail,
} from "@/lib/pokemon";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PokemonInBattle } from "../ui/PokemonInBattle";
import type { Insult, GameState } from "@/types/index";
import { useAuth } from "@/context/AuthContext";

export const MAX_INSULT = 60;
const API_URL = import.meta.env.VITE_API_SERVER_URL;

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
  const auth = useAuth();

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
      setGameState("readyToStart");
      setOpponentPokemon(data);
      break;
    }
  };

  const startGame = () => {
    setGameState("gettingOpponentsInsult");
  };

  const getInsult = async () => {
    const res = await fetch(`${API_URL}/ai/create-insult/`, {
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
    const res = await fetch(`${API_URL}/ai/rate-insult/`, {
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

  const sumUpInsult = async () => {
    // Helper to neve set new insult higher then MAX_INSULT
    const capInsult = (prev: number, add: string) => {
      if (prev + Number(add) > MAX_INSULT) return MAX_INSULT;
      return prev + Number(add);
    };

    // Get Insult damage from api
    const insultDamage = await rateInsult(
      gameState === "ratingOpponentsInsult"
        ? (opponentPokemon?.name ?? "")
        : (playerPokemon?.name ?? ""),
      gameState === "ratingOpponentsInsult"
        ? (playerPokemon?.name ?? "")
        : (opponentPokemon?.name ?? ""),
      gameState === "ratingOpponentsInsult"
        ? opponentCreatedInsults[opponentCreatedInsults.length - 1].insult
        : playerCreatedInsults[opponentCreatedInsults.length - 1].insult,
    );

    // Apply insult damage
    if (gameState === "ratingOpponentsInsult") {
      setPlayerInsultLevel((prev) => capInsult(prev, insultDamage));
    } else {
      setOpponentInsultLevel((prev) => capInsult(prev, insultDamage));
    }

    // Set new game state
    if (gameState === "ratingOpponentsInsult") {
      setGameState("gettingPlayersInsult");
    } else {
      setGameState("gettingOpponentsInsult");
    }
  };

  const postScore = async () => {
    const userId = auth.user?._id;
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        score: (opponentInsultLevel - playerInsultLevel) * 1000,
      }),
    });
    if (!res.ok) throw new Error("Connection to API failed");
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    if (gameState === "gameOver") {
      postScore();
    } else if (
      playerInsultLevel >= MAX_INSULT ||
      opponentInsultLevel >= MAX_INSULT
    ) {
      setGameState("gameOver");
    } else if (gameState === "loadingOpponent" && listData?.count) {
      fetchRandomOpponent();
    } else if (gameState === "gettingOpponentsInsult") {
      getInsult();
    } else if (gameState === "ratingOpponentsInsult") {
      sumUpInsult();
    } else if (gameState === "ratingPlayersInsult") {
      sumUpInsult();
    }
    console.log(gameState);
  }, [gameState, listData?.count]);

  return (
    <>
      {
        <div className="container mx-auto px-4 py-8">
          <div className="relative w-full rounded-md overflow-hidden">
            {/* The image container defines the complete space we have. All elements are positioned absolute */}
            <div className="h-[70vh] xl:h-auto">
              <img
                src="/img/bg1.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            {gameState === "loadingOpponent" && (
              <div className="absolute top-1/2 left-1/2 -ml-25 lg:-ml-50">
                <img src="/img/loading.png" className="w-50 lg:w-100 " alt="" />
              </div>
            )}
            {gameState === "gameOver" && (
              <>
                {playerInsultLevel <= opponentInsultLevel ? (
                  <div className="absolute top-1/2 left-1/2 -ml-20 lg:-ml-30 z-50">
                    <img
                      src="/img/youwin.png"
                      className="w-40 lg:w-60 "
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="absolute top-1/2 left-1/2 -ml-25 lg:-ml-50 z-50">
                    <img
                      src="/img/gameover.png"
                      className="w-50 lg:w-100 "
                      alt=""
                    />
                  </div>
                )}
              </>
            )}
            {gameState === "readyToStart" && (
              <div
                className="absolute top-1/2 left-1/2 -ml-25 cursor-pointer z-20"
                onClick={startGame}
              >
                <img src="/img/start.png" className="w-50" alt="" />
              </div>
            )}
            <div className="absolute h-full top-0 flex gap-2 md:gap-4 lg:gap-20  justify-center w-full z-10 p-2 lg:p-6">
              <div className="relative w-90">
                {opponentPokemon && (
                  <PokemonInBattle
                    pokemon={opponentPokemon}
                    insultLevel={opponentInsultLevel}
                    insults={opponentCreatedInsults}
                    isPlayer={false}
                    gameState={gameState}
                    setGameState={setGameState}
                    setPlayerCreatedInsults={setPlayerCreatedInsults}
                  />
                )}
              </div>
              <div className="relative w-90">
                {playerPokemon && (
                  <PokemonInBattle
                    pokemon={playerPokemon}
                    insultLevel={playerInsultLevel}
                    insults={playerCreatedInsults}
                    isPlayer={true}
                    gameState={gameState}
                    setGameState={setGameState}
                    setPlayerCreatedInsults={setPlayerCreatedInsults}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};
