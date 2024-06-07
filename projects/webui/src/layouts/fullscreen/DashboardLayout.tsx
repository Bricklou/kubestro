import { ReactElement, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/partials/Navbar.tsx";
import { Sidebar } from "@/components/partials/Sidebar.tsx";

export function DashboardLayout(): ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex flex-col flex-1">
        <Navbar
          toggleSidebar={() => {
            setOpen((o) => !o);
          }}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
