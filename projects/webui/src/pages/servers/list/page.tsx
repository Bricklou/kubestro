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
    <section>
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Servers list</PageTitle>
          <PageSubtitle>
            All your deployed servers are listed here.
          </PageSubtitle>
        </PageTitleContainer>

        <PageActions>
          <Button>
            <PackagePlusIcon className="size-5" />
          </Button>
        </PageActions>
      </PageHeader>
    </section>
  );
}
