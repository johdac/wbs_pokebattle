import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./components/layout/Home";

export const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [{ path: "/", element: <Home></Home> }],
  },
]);
