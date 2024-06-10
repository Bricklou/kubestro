import { fetchNamespaces } from "@/api/resources/namespaces.ts";
import { QueryFn } from "@/api/fetcher.ts";

export const namespaceQuery: QueryFn<string[]> = () => ({
  queryKey: ["namespaces", "list"],
  queryFn: () => fetchNamespaces(),
});
