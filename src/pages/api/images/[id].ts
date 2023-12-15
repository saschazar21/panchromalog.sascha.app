import { executeQuery } from "@utils/db/neon";
import { type Image, getImageByIdQuery } from "@utils/db/neon/images";
import type { APIRoute } from "astro";

const CACHE_DURATION = 3.15576e7;

export const GET: APIRoute = async ({ params }): Promise<Response> => {
  const id = params.id as string;

  const [result] = await executeQuery<Image>(getImageByIdQuery(id));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, s-maxage=${CACHE_DURATION.toString()}, max-age=${CACHE_DURATION.toString()}`,
    },
  });
};
