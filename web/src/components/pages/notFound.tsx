import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <AlertCircle className="h-20 w-20 text-primary mb-6 animate-pulse" />
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/home"
        className="inline-block rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-background transition-all hover:bg-primary/80"
      >
        Go Back Home
      </Link>
    </div>
  );
}
