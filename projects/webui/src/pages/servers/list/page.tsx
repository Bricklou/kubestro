import { ReactElement } from "react";
import {
  PageActions,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageTitleContainer,
} from "@/components/partials/PageHeader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PackagePlusIcon } from "lucide-react";

export function ServersList(): ReactElement {
  return (
    <section className="@container">
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Servers list</PageTitle>
          <PageSubtitle>
            All your deployed servers are listed here.
          </PageSubtitle>
        </PageTitleContainer>

        <PageActions>
          <Button className="gap-2 w-full @lg:w-auto">
            <PackagePlusIcon className="size-5" />
            <span className="@lg:sr-only">Add server</span>
          </Button>
        </PageActions>
      </PageHeader>

      <main className="p-8 @lg:px-12 flex flex-col">
        <p>hello</p>
      </main>
    </section>
  );
}
