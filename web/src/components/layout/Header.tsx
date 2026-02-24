import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Trophy, Users, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/home", label: "Pokédex", icon: Home },
  { to: "/roster", label: "Roster", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export const Header = () => {
  const { user, isLoading, handleSignOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-8">
        {/* Logo Section */}
        <Link to="/home">
          <span className="font-display text-xl font-bold text-gradient-primary">
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
          <div
            className="relative ml-4 cursor-pointer"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 p-1 pr-3 transition-all hover:bg-secondary/50 cursor-pointer">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ">
                {user?.username?.charAt(0).toUpperCase() || "T"}
              </div>
              <span className="hidden text-xs font-semibold lg:block">
                {isLoading ? (
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  user?.username || "Guest"
                )}
              </span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl border border-border bg-background p-1 shadow-xl"
                >
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Trainer Account
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSignOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 cursor-pointer" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
