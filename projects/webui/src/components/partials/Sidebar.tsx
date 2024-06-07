import { ReactElement } from "react";

export function Sidebar(): ReactElement {
  return (
    <aside className="border-r w-80 flex flex-col">
      <p className="text-2xl font-bold p-4 py-8 text-center">Kubestro</p>

      <nav className="flex-1"></nav>
    </aside>
  );
}
