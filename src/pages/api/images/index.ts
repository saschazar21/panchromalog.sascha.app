import { executeQuery } from "@utils/db/neon";
import { type Image, getImagesQuery } from "@utils/db/neon/images";
import { type Page } from "@utils/db/sql";
import { parsePaginationParams } from "@utils/helpers";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  const { searchParams } = new URL(request.url);
  const [size, offset] = parsePaginationParams(searchParams);

  const camera = searchParams.get("camera");
  const lens = searchParams.get("lens");
  const film = searchParams.get("film");

  const res = await executeQuery<Page<Image>>(
    getImagesQuery({
      size,
      offset,
      camera,
      lens,
      film,
    })
  );

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      pragma: "no-cache",
    },
  });
};
