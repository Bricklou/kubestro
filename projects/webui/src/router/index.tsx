import { createBrowserRouter } from "react-router-dom";
import { FullscreenLayout } from "@/layouts/fullscreen/FullscreenLayout.tsx";
import { Login } from "@/pages/login/page.tsx";
import { DashboardLayout } from "@/layouts/fullscreen/DashboardLayout.tsx";

export const router = createBrowserRouter([
  {
    element: <FullscreenLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
      },
    ],
  },
]);
