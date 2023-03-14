import { getLenses } from "@utils/graphql/lenses/lenses";
import type { APIRoute } from "astro";

const DURATION_MAX_AGE = 86400;
const DURATION_STALE = 86400;

export const get: APIRoute = async ({ url }) => {
  const { searchParams } = new URL(url);
  const mount = searchParams.get("mount");

  const res = await getLenses(mount ? { mount } : undefined);

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, s-maxage=${DURATION_MAX_AGE}, max-age=${DURATION_MAX_AGE}, stale-while-revalidate=${DURATION_STALE}`,
    },
  });
};
