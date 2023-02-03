import { getImages } from "@utils/graphql/images/images";
import type { APIRoute } from "astro";

export const DEFAULT_SIZE = 15;

export const get: APIRoute = async ({ request }): Promise<Response> => {
  const url = new URL(request.url);
  const params = url.searchParams;

  const variables = new Map<string, string | number>();

  params.get("cursor")?.length &&
    variables.set("_cursor", params.get("cursor") as string);
  params.get("camera")?.length &&
    variables.set("camera", params.get("camera") as string);
  params.get("lens")?.length &&
    variables.set("lens", params.get("lens") as string);
  params.get("film")?.length &&
    variables.set("film", params.get("film") as string);

  if (params.get("size")?.length) {
    const parsed = parseInt(params.get("size") as string, 10);

    !isNaN(parsed) && variables.set("_size", parsed);
  } else {
    variables.set("_size", DEFAULT_SIZE);
  }

  const res = await getImages(Object.fromEntries(variables));

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      pragma: "no-cache",
    },
  });
};
