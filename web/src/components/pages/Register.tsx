import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import loginPic from "../../assets/fig.jpg";
import { pikachuImg } from "@/lib/pokemon";
import { useAuth } from "@/context/AuthContext";

export const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, user, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      console.log(username, email);
      await handleRegister({
        username,
        email,
        password,
        confirmPassword,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong during registration.");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={loginPic}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center space-y-2 mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl  glow-primary">
              <img
                src={pikachuImg}
                className="h-10 w-10 text-primary-foreground"
              />
            </div>
          </motion.div>
          <div className="text-2xl font-bold text-gradient-primary">
            Join PokéBattle
          </div>
          <div className="text-muted-foreground">
            Create your trainer account
          </div>
        </div>
        {/* Error Message*/}
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="AshKetchum99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-default pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="trainer@pokebattle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-default  pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-default  pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-default  pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <button className="w-full cursor-pointer rounded-xl px-4 py-2  gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary">
            Create Account
          </button>
        </form>
        <form className="justify-center pt-5">
          <p className="text-sm text-muted-foreground">
            Already have an account?
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
