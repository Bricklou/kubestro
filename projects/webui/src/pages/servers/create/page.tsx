import { ReactElement } from "react";
import {
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageTitleContainer,
} from "@/components/partials/PageHeader.tsx";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { z } from "zod";
import { Input } from "@/components/ui/input.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { NamespaceCombo } from "@/pages/servers/create/namespaceCombo.tsx";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button.tsx";
import { PackagePlusIcon } from "lucide-react";
import { QueryClient } from "@tanstack/react-query";
import { namespaceQuery } from "@/api/queries/namespaces.ts";
import { getOrQuery, useLoaderQuery } from "@/api/fetcher.ts";

export const serverCreateLoader = (queryClient: QueryClient) => async () => {
  const query = namespaceQuery();
  const gotData = getOrQuery(queryClient, query);
  return gotData;
};

export function ServerCreate(): ReactElement {
  const { data: namespaces } =
    useLoaderQuery<typeof serverCreateLoader>(namespaceQuery());

  return (
    <section className="@container h-full flex flex-col">
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Create a server</PageTitle>
          <PageSubtitle>Create a new Minecraft server instance.</PageSubtitle>
        </PageTitleContainer>
      </PageHeader>

      <main className="p-8 @lg:px-12 flex-1 flex flex-col">
        <CreateServerForm namespaces={namespaces} />
      </main>
    </section>
  );
}

const formSchema = z.object({
  name: z.string().min(2).max(100),
  namespace: z
    .string()
    .min(2)
    .max(63)
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/, {
      message: "Invalid namespace format",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

function CreateServerForm({
  namespaces,
}: {
  namespaces: string[];
}): ReactElement {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      namespace: "",
    },
  });

  function onSubmit(value: FormSchema): void {
    console.log(value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the name display on the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="namespace"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Namespace</FormLabel>

                <ErrorBoundary fallbackRender={fallbackRender}>
                  <NamespaceCombo
                    className="w-auto"
                    items={namespaces}
                    value={field.value}
                    onChange={field.onChange}
                    onCreate={(value) => {
                      field.onChange(value);
                    }}
                  />
                </ErrorBoundary>
                <FormDescription>
                  This will be the kubernetes namespace were the server will be
                  created.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-end">
          <Button type="submit">
            <PackagePlusIcon className="mr-2 size-4" />
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}

function fallbackRender({ error }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{(error as Error).message}</pre>
    </div>
  );
}
