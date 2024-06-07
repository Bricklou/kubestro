import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

export function FullscreenLayout(): ReactElement {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-graphPaper">
      <Outlet />
    </div>
  );
}
