import { Button } from "@/components/ui/button.tsx";
import { HomeIcon, LogOutIcon, SearchIcon, SlashIcon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import {
  Fragment,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useMemo,
} from "react";
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

function NavBreadcrumb(props: HTMLAttributes<HTMLElement>): ReactElement {
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
        ...list.slice(0, -1),
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
    <Breadcrumb {...props}>
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
    <header className="p-4 grid grid-flow-row-dense grid-cols-[min-content_auto_min-content] lg:grid-cols-[auto_auto_min-content] auto-rows-auto gap-2 gap-y-4 items-center">
      <SidebarToggle
        toggleSidebar={toggleSidebar}
        className="row-start-1 col-start-1"
      />
      <NavBreadcrumb className="inline-flex row-start-2 col-span-3 lg:row-start-1 lg:col-span-1 lg:col-start-1 px-4 py-2" />

      <div className="relative inline-flex md:max-w-screen-sm row-start-1 md:col-span-2 lg:col-span-1 lg:col-start-2 w-full items-center justify-self-end">
        <Input className="pl-9" placeholder="Search..." />
        <SearchIcon
          className="absolute left-0 mx-2 text-muted-foreground size-5"
          aria-hidden={true}
        />
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="gap-x-2 row-start-1 md:col-start-3 max-w-min col"
      >
        <LogOutIcon className="size-5" />
        <div className="sr-only md:not-sr-only">Logout</div>
      </Button>
    </header>
  );
}
