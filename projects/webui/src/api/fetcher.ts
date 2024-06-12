import ky from "ky";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

export const queryClient = new QueryClient();

export const fetcher = ky.create({});

export interface QueryOptions<T> {
  queryKey: string[];
  queryFn: <P = unknown[]>(...params: P[]) => Promise<T>;
}

export type QueryFn<Result, Params = unknown> = (
  ...params: Params[]
) => QueryOptions<Result>;

export type LoaderFn = (queryClient: QueryClient) => () => Promise<unknown>;

export const getOrQuery = async <Result>(
  client: QueryClient,
  options: QueryOptions<Result>,
): Promise<Result> => {
  return (
    client.getQueryData(options.queryKey) ?? (await client.fetchQuery(options))
  );
};

export const mutateQuery = async <Result>(
  client: QueryClient,
  options: QueryOptions<Result>,
): Promise<Result> => {
  const result = await options.queryFn();
  await client.invalidateQueries({ queryKey: options.queryKey });
  return result;
};

export const useLoaderQuery = <
  Loader extends LoaderFn,
  Result = Awaited<ReturnType<ReturnType<Loader>>>,
>(
  queryOptions: QueryOptions<Result>,
) => {
  const initialData = useLoaderData() as Exclude<Result, undefined>;

  return useQuery({
    ...queryOptions,
    initialData,
  });
};
