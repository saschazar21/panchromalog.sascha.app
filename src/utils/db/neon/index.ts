import type { NeonQueryPromise } from "@neondatabase/serverless";
import { getQuery } from "./client";

export type QueryTuple = [string, unknown[]?];

export const executeQuery = async <T>(query: QueryTuple) => {
  const sql = await getQuery();
  return sql(...query) as NeonQueryPromise<false, false, [T]>;
};

export const executeTransaction = async <T>(queries: QueryTuple[]) => {
  const sql = await getQuery();

  const segments = queries.map((query) => sql(...query));

  return sql.transaction(segments) as Promise<T>;
};
