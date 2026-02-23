import { MAX_INSULT } from "@/components/pages/BattlePage";

export const InsultBar = ({ value }: { value: number }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-xs font-medium text-muted-foreground capitalize md:block hidden">
        Insulted
      </span>
      <span className="md:w-8 text-right text-xs font-bold text-foreground">
        {value}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary w-24">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(value / MAX_INSULT) * 100}%` }}
        />
      </div>
    </div>
  );
};
