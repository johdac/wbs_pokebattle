import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./components/pages/Home";
import { PokemonDetail } from "./components/pages/PokemonDetail";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { Roster } from "./components/pages/Roster";
import { RouteGuard } from "./router/RouteGuard";
import { Leaderboard } from "./components/pages/LeaderBoard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <RouteGuard type="public" redirectTo="/home" />,
    children: [
      { path: "/login", element: <Login></Login> },
      { path: "/register", element: <Register></Register> },
    ],
  },
  {
    element: <RouteGuard type="protected" redirectTo="/login" />,
    children: [
      {
        element: <AppLayout></AppLayout>,
        children: [
          { path: "/home", element: <Home></Home> },
          {
            path: "/pokemon/:id",
            element: <PokemonDetail></PokemonDetail>,
          },
          { path: "/roster", element: <Roster></Roster> },
          {
            path: "/leaderboard",
            element: <Leaderboard></Leaderboard>,
          },
        ],
      },
    ],
  },
]);
