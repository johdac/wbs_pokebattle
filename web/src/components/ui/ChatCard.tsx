import type { Insult } from "@/types";

type ChatCardProps = {
  message: Insult;
  isPlayer: boolean;
};

export const ChatCard = ({ message, isPlayer }: ChatCardProps) => {
  return (
    <>
      <div
        className={`flex items-end gap-2 ${
          isPlayer ? "justify-end" : "justify-start"
        }`}
      >
        <div className="flex flex-col">
          <div
            className={`
            px-4 py-2 rounded-2xl text-sm mt-2 shadow-sm bg-primary text-primary-foreground
            ${isPlayer ? "rounded-br-none" : "rounded-bl-none"}
          `}
          >
            {message.insult}
          </div>
        </div>
      </div>
    </>
  );
};
