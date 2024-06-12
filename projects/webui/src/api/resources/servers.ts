import { fetcher } from "@/api/fetcher.ts";

interface CreateServerParams {
  name: string;
  namespace: string;
}
export const createServer = async (params: CreateServerParams): Promise<void> =>
  fetcher("/api/servers", {
    method: "POST",
    body: JSON.stringify(params),
  }).json();
