import { ReactElement } from "react";
import {
  PageActions,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageTitleContainer,
} from "@/components/partials/PageHeader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PackagePlusIcon, SearchXIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function ServersList(): ReactElement {
  return (
    <section className="@container h-full flex flex-col">
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Servers list</PageTitle>
          <PageSubtitle>
            All your deployed servers are listed here.
          </PageSubtitle>
        </PageTitleContainer>

        <PageActions>
          <Button className="gap-2 w-full @lg:w-auto" asChild>
            <Link to="/servers/new">
              <PackagePlusIcon className="size-5" />
              <span className="@lg:sr-only">Add server</span>
            </Link>
          </Button>
        </PageActions>
      </PageHeader>

      <main className="p-8 @lg:px-12 flex-1 flex flex-col">
        <ListContent />
      </main>
    </section>
  );
}

function ListContent(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1">
      <SearchXIcon className="size-20 text-muted-foreground" />
      <p className="text-center text-muted-foreground">
        There is no servers for now.
        <br />
        Please create one to continue.
      </p>
    </div>
  );
}
