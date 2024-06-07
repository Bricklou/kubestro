import { PropsWithChildren, ReactElement } from "react";

export function PageHeader({ children }: PropsWithChildren): ReactElement {
  return (
    <header className="p-8 md:px-12 flex flex-col gap-2">{children}</header>
  );
}

export function PageTitle({ children }: PropsWithChildren): ReactElement {
  return <h2 className="text-3xl font-semibold">{children}</h2>;
}

export function PageSubtitle({ children }: PropsWithChildren): ReactElement {
  return <p className="text-muted-foreground">{children}</p>;
}
