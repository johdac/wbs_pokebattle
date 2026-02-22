import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./components/pages/Home";
import { PokemonDetail } from "./components/pages/PokemonDetail";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { Roster } from "./components/pages/Roster";
import { BattlePage } from "./components/pages/BattlePage";

export const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [
      { path: "/", element: <Home></Home> },
      {
        path: "/battle/:id",
        element: <BattlePage></BattlePage>,
      },
      { path: "/login", element: <Login></Login> },
      {
        path: "/pokemon/:id",
        element: <PokemonDetail></PokemonDetail>,
      },
      { path: "/register", element: <Register></Register> },
      { path: "/roster", element: <Roster></Roster> },
    ],
  },
]);
