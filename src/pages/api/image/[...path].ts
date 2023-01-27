import type { APIRoute } from "astro";

if (!import.meta.env.IMAGEKIT_ID) {
  throw new Error("ERROR: IMAGEKIT_ID env not defined!");
}

const IMAGEKIT_BASE_URL = "https://ik.imagekit.io";
const CACHE_DURATION = 3.15576e7;

export const get: APIRoute = async ({ params }): Promise<Response> => {
  const { path } = params;

  try {
    const url = new URL(
      "/" + import.meta.env.IMAGEKIT_ID + "/" + path,
      IMAGEKIT_BASE_URL
    );

    const res = await fetch(url);

    const headers = res.headers;

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        ...headers,
        "Cache-Control": `public, s-maxage=${CACHE_DURATION.toString()}, max-age=${CACHE_DURATION.toString()}`,
      },
    });
  } catch (e) {
    console.log((e as Error).message);

    return new Response("Image Not Found", { status: 404 });
  }
};
