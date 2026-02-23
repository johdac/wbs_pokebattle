import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  type: "protected" | "public";
  redirectTo: string;
  loadingMessage?: string;
}

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  </div>
);

export const RouteGuard = ({
  type,
  redirectTo,
  loadingMessage = "Verifying Trainer session...",
}: RouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = user || token;

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  if (type === "protected" && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (type === "public" && isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
