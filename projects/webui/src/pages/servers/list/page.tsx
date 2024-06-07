import { ReactElement } from "react";
import {
  PageHeader,
  PageSubtitle,
  PageTitle,
} from "@/components/partials/PageHeader.tsx";

export function ServersList(): ReactElement {
  return (
    <section>
      <PageHeader>
        <PageTitle>Servers list</PageTitle>
        <PageSubtitle>All your deployed servers are listed here.</PageSubtitle>
      </PageHeader>
    </section>
  );
}
