import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Create } from "./pages/Create";
import { VoteSelect } from "./pages/VoteSelect";
import { ResultsSelect } from "./pages/ResultsSelect";
import LayoutComponent from "./Layout.js";
import { Vote } from "./pages/Vote.js";
import { Results } from "./pages/Results.js";

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
        element: <VoteSelect />,
      },
      {
        path: "vote/:id",
        element: <Vote />,
      },
      {
        path: "results",
        element: <ResultsSelect />,
      },
      {
        path: "results/:id",
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
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
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
