import { Button } from "@/components/ui/button.tsx";
import { HomeIcon, LogOutIcon, SearchIcon, SlashIcon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Fragment, ReactElement, ReactNode, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { NavLink, UIMatch, useMatches } from "react-router-dom";
import { SidebarToggle } from "@/components/partials/Sidebar.tsx";

interface Handle {
  crumb: string;
}

type CrumbItem =
  | { type: "text"; name: ReactNode }
  | { type: "link"; name: ReactNode; href: string }
  | { type: "ellipsis" };

function NavBreadcrumbItem({ crumb }: { crumb: CrumbItem }): ReactElement {
  if (crumb.type === "ellipsis") {
    return <BreadcrumbEllipsis />;
  }

  if (crumb.type === "text") {
    return <BreadcrumbItem>{crumb.name}</BreadcrumbItem>;
  }

  return (
    <BreadcrumbLink asChild>
      <NavLink to={crumb.href}>{crumb.name}</NavLink>
    </BreadcrumbLink>
  );
}

function NavBreadcrumb(): ReactElement {
  const matches = useMatches() as UIMatch<unknown, Handle | undefined>[];
  const crumbs = useMemo<CrumbItem[]>(() => {
    const list: { type: "link"; name: string; href: string }[] = matches
      .filter((match): match is UIMatch<unknown, Handle> =>
        Boolean(match.handle?.crumb),
      )
      .map(
        (match) =>
          ({
            type: "link",
            name: match.handle.crumb,
            href: match.pathname,
          }) satisfies CrumbItem,
      );

    const homeItem: CrumbItem = {
      type: "link",
      name: <HomeIcon className="size-5" />,
      href: "/",
    };

    if (list.length <= 3) {
      return [
        homeItem,
        ...list.slice(0, list.length - 2),
        { type: "text", name: list[list.length - 1].name },
      ];
    }

    return [
      homeItem,
      list[0],
      { type: "ellipsis" },
      list[list.length - 2],
      { type: "text", name: list[list.length - 1].name },
    ];
  }, [matches]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={index}>
            <NavBreadcrumbItem crumb={crumb} />
            {index < crumbs.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <header className="p-4 flex flex-row @container gap-x-2 items-center">
      <div className="flex-1 px-4 flex flex-row gap-4 items-center">
        <SidebarToggle toggleSidebar={toggleSidebar} />
        <NavBreadcrumb />
      </div>
      <div className="flex flex-1 flex-row gap-2 justify-end">
        <div className="relative inline-flex @md:max-w-screen-sm w-full items-center">
          <Input className="pl-9" placeholder="Search..." />
          <SearchIcon
            className="absolute left-0 mx-2 text-muted-foreground size-5"
            aria-hidden={true}
          />
        </div>
        <Button variant="secondary" size="sm" className="gap-x-2">
          <LogOutIcon className="size-5" />
          Logout
        </Button>
      </div>
    </header>
  );
}
