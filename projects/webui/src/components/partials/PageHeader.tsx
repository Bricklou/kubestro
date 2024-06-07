import { PropsWithChildren, ReactElement } from "react";

export function PageHeader({ children }: PropsWithChildren): ReactElement {
  return (
    <header className="p-8 md:px-12 flex row gap-2 items-end">
      {children}
    </header>
  );
}

export function PageTitleContainer({
  children,
}: PropsWithChildren): ReactElement {
  return <div className="flex-1 flex flex-col gap-2">{children}</div>;
}

export function PageTitle({ children }: PropsWithChildren): ReactElement {
  return <h2 className="text-3xl font-semibold">{children}</h2>;
}

export function PageSubtitle({ children }: PropsWithChildren): ReactElement {
  return <p className="text-muted-foreground">{children}</p>;
}

export function PageActions({ children }: PropsWithChildren): ReactElement {
  return <div>{children}</div>;
}
