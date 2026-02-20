interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

export const StatBar = ({ label, value, max = 255 }: StatBarProps) => {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs font-medium text-muted-foreground capitalize">
        {label.replace("-", " ")}
      </span>
      <span className="w-8 text-right text-xs font-bold text-foreground">
        {value}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
