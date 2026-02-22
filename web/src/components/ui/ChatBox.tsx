import type { GameState, Insult } from "@/types";
import { ChatCard } from "./ChatCard";
import { useEffect, useRef, useState } from "react";

type ChatBoxProps = {
  messages: Insult[];
  isPlayer: boolean;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setPlayerCreatedInsults: React.Dispatch<React.SetStateAction<Insult[]>>;
};

export const ChatBox = ({
  messages,
  isPlayer,
  gameState,
  setGameState,
  setPlayerCreatedInsults,
}: ChatBoxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [insultText, setInsultText] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const insultObj = { insult: insultText };
      setPlayerCreatedInsults((prev) => {
        return [...prev, insultObj];
      });
      setInsultText("");
      setGameState("ratingPlayersInsult");
    }
  };

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
          <div className="h-16 mt-2 animate-pulse rounded-xl bg-secondary" />
        )}
        {gameState === "gettingPlayersInsult" && isPlayer && (
          <>
            <textarea
              value={insultText}
              className="mt-2 bg-accent-foreground"
              rows={3}
              name="insult"
              placeholder="Burn 'em and hit Enter to send!"
              onChange={(e) => setInsultText(e.target.value)}
              onKeyDown={handleKeyDown}
            ></textarea>
          </>
        )}
      </div>
    </>
  );
};
