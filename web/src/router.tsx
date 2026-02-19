import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./components/pages/Home";
import { PokemonDetail } from "./components/pages/PokemonDetail";

export const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [
      { path: "/", element: <Home></Home> },
      {
        path: "/pokemon/:id",
        element: <PokemonDetail></PokemonDetail>,
      },
    ],
  },
]);
