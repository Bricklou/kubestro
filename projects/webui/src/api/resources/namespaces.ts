import { fetcher } from "@/api/fetcher.ts";

export const fetchNamespaces = () =>
  fetcher("/api/namespaces")
    .json<{
      message: string;
      namespaces: string[];
    }>()
    .then((data) => data.namespaces);
