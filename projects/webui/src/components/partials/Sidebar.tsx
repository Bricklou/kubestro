import { PropsWithChildren, ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { GlobeIcon, LucideIcon, ServerIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button.tsx";

type SidebarItemProps = PropsWithChildren<{
  icon: LucideIcon;
  to: string;
}>;

function SidebarItem({ children, icon: Icon, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        buttonVariants({
          className: "inline-flex items-center gap-x-2 justify-start",
          variant: isActive ? "default" : "ghost",
        })
      }
    >
      <Icon className="size-5" />
      {children}
    </NavLink>
  );
}

export function SidebarSection({ children }: PropsWithChildren<object>) {
  return <section className="flex flex-col gap-2">{children}</section>;
}

export function SidebarLabel({ children }: PropsWithChildren<object>) {
  return <p className="text-sm uppercase text-muted-foreground">{children}</p>;
}

export function Sidebar(): ReactElement {
  return (
    <aside className="border-r w-80 flex flex-col">
      <p className="text-2xl font-bold p-4 py-8 text-center">Kubestro</p>

      <nav className="flex-1 flex flex-col px-2 py-4">
        <SidebarSection>
          <SidebarLabel>Administration</SidebarLabel>
          <SidebarItem icon={GlobeIcon} to="/">
            Overview
          </SidebarItem>
          <SidebarItem icon={ServerIcon} to="/servers">
            Servers
          </SidebarItem>
        </SidebarSection>
      </nav>
    </aside>
  );
}
