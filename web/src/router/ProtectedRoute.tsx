import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
export const ProtectedRout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Verifying Trainer session...
          </p>
        </div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
