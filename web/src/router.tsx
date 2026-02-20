import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./components/pages/Home";
import { PokemonDetail } from "./components/pages/PokemonDetail";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";

export const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [
      { path: "/login", element: <Login></Login> },
      { path: "/register", element: <Register></Register> },
      { path: "/", element: <Home></Home> },
      {
        path: "/pokemon/:id",
        element: <PokemonDetail></PokemonDetail>,
      },
    ],
  },
]);
