import { QueryFn } from "@/api/fetcher.ts";
import { createServer } from "@/api/resources/servers.ts";

interface CreateServerMutationParams {
  name: string;
  namespace: string;
}

export const createServerMutation: QueryFn<void, CreateServerMutationParams> = (
  params: CreateServerMutationParams,
) => ({
  queryKey: ["servers", "create"],
  queryFn: () => createServer(params),
});
