import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Create } from "./pages/Create";
import { Vote } from "./pages/Vote";
import { Results } from "./pages/Results";
import LayoutComponent from "./Layout.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "vote",
        element: <Vote />,
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export function App() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
    </>
  );
}

function Layout() {
  return (
    <LayoutComponent>
      <Outlet />
    </LayoutComponent>
  );
}
