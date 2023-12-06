import { getImage } from "@utils/graphql/images/image";
import type { APIRoute } from "astro";

const CACHE_DURATION = 3.15576e7;

export const GET: APIRoute = async ({ params }): Promise<Response> => {
  const variables = {
    id: params.id as string,
  };

  const res = await getImage(variables);

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, s-maxage=${CACHE_DURATION.toString()}, max-age=${CACHE_DURATION.toString()}`,
    },
  });
};
