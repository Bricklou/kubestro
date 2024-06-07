import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/partials/Navbar.tsx";
import { Sidebar } from "@/components/partials/Sidebar.tsx";

export function DashboardLayout(): ReactElement {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
