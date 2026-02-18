import { Outlet, useNavigation } from "react-router";
import { Header } from "./Header";

export const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <div>
      <Header></Header>
      {navigation.state === "loading" && <p>Loading...</p>}

      <main>
        <Outlet />
      </main>
    </div>
  );
};
