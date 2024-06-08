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

export function ServerCreate(): ReactElement {
  return (
    <section className="@container h-full flex flex-col">
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Create a server</PageTitle>
          <PageSubtitle>Create a new Minecraft server instance.</PageSubtitle>
        </PageTitleContainer>
      </PageHeader>

      <main className="p-8 @lg:px-12 flex-1 flex flex-col">
        <CreateServerForm />
      </main>
    </section>
  );
}

const formSchema = z.object({
  name: z.string().min(2).max(63),
  namespace: z
    .string()
    .max(63)
    .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/),
});

type FormSchema = z.infer<typeof formSchema>;

function CreateServerForm(): ReactElement {
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
                    items={["aaa", "bbb", "ccc", "abb", "abc"]}
                    value={field.value}
                    onChange={field.onChange}
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
