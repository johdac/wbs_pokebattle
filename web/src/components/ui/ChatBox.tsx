import type { GameState, Insult } from "@/types";
import { ChatCard } from "./ChatCard";
import { useEffect, useRef } from "react";
import { input } from "framer-motion/client";

type ChatBoxProps = {
  messages: Insult[];
  isPlayer: boolean;
  gameState: GameState;
};

export const ChatBox = ({ messages, isPlayer, gameState }: ChatBoxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);
  return (
    <>
      <div
        ref={containerRef}
        className={`chat ${isPlayer ? "chat-start" : "chat-end"} h-60 w-90 overflow-y-auto px-2`}
      >
        {messages.map((message) => {
          return <ChatCard message={message} isPlayer={isPlayer}></ChatCard>;
        })}
        {gameState === "gettingOpponentsInsult" && !isPlayer && (
          <div className="h-20 animate-pulse rounded-xl bg-secondary" />
        )}
        {gameState === "gettingPlayersInsult" && isPlayer && (
          <input type="text" placeholder="Burn 'em!"></input>
        )}
      </div>
    </>
  );
};
