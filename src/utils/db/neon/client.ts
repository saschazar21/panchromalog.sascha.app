import { neon, type HTTPQueryOptions } from "@neondatabase/serverless";

export const getQuery = (options?: HTTPQueryOptions<false, false>) => {
  if (!import.meta.env.DATABASE_URL?.length) {
    throw new Error("ERROR: DATABASE_URL env is not set!");
  }
  return neon(import.meta.env.DATABASE_URL, options);
};
