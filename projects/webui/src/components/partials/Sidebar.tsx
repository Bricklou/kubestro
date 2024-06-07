import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  GlobeIcon,
  LucideIcon,
  MenuIcon,
  ServerIcon,
  XIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

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

function SidebarSection({ children }: PropsWithChildren<object>) {
  return <section className="flex flex-col gap-2">{children}</section>;
}

function SidebarLabel({ children }: PropsWithChildren<object>) {
  return <p className="text-sm uppercase text-muted-foreground">{children}</p>;
}

const SIDEBAR_POPOVER_ID = "sidebar-popover";

export function SidebarToggle({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}): ReactElement {
  return (
    <Button
      variant="outline"
      size="icon"
      className="md:hidden"
      onClick={() => {
        toggleSidebar();
      }}
      popovertarget={SIDEBAR_POPOVER_ID}
    >
      <MenuIcon className="size-4" />
    </Button>
  );
}

export function Sidebar(): ReactElement {
  const { pathname } = useLocation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.hidePopover();
  }, [pathname]);

  return (
    <aside
      ref={ref}
      id={SIDEBAR_POPOVER_ID}
      popover="auto"
      className={cn(
        "bg-background border-r w-full md:w-80 [&:popover-open]:flex md:flex md:m-0 md:static flex-col h-screen overflow-y-hidden",
      )}
    >
      <div className="flex item-center justify-between gap-2 p-6">
        <p className="text-2xl font-bold p-4 py-8 text-center">Kubestro</p>
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          popovertarget={SIDEBAR_POPOVER_ID}
          popovertargetaction="hide"
        >
          <XIcon className="size-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>

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
