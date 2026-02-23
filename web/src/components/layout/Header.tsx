import { Link } from "react-router";
import { Home, Trophy, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Pokédex", icon: Home },
  { to: "/roster", label: "Roster", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export const Header = () => {
  return (
    <>
      <div className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-8">
          <Link to="/">
            <span className="font-display text-xl font-bold text-gradient-primary ">
              PokéBattle
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
