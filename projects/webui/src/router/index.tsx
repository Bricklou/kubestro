import { createBrowserRouter } from "react-router-dom";
import { FullscreenLayout } from "@/layouts/fullscreen/FullscreenLayout.tsx";
import { Login } from "@/pages/login/page.tsx";
import { DashboardLayout } from "@/layouts/fullscreen/DashboardLayout.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { Overview } from "@/pages/overview/page.tsx";
import { ServersList } from "@/pages/servers/list/page.tsx";
import { ServerCreate } from "@/pages/servers/create/page.tsx";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary fallbackRender={ErrorFallback} />,

    children: [
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
            element: <Overview />,
            handle: {
              crumb: "Overview",
            },
          },
          {
            path: "/servers",
            handle: {
              crumb: "Servers",
            },
            children: [
              {
                path: "/servers",
                element: <ServersList />,
              },
              {
                path: "/servers/new",
                element: <ServerCreate />,
                handle: {
                  crumb: "Create",
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);
