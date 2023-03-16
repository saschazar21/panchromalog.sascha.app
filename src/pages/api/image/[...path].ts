import type { APIRoute } from "astro";

if (!import.meta.env.IMAGEKIT_ID) {
  throw new Error("ERROR: IMAGEKIT_ID env not defined!");
}

export const IMAGE_ROUTE_PATH = "/_image";
const IMAGEKIT_BASE_URL = "https://ik.imagekit.io";
const CACHE_DURATION = 3.15576e7;

export const get: APIRoute = async ({
  params,
  url: currentUrl,
}): Promise<Response> => {
  const { path } = params;
  const { searchParams } = new URL(currentUrl);

  try {
    const href = new URL(
      `/${import.meta.env.IMAGEKIT_ID}/${path}`,
      IMAGEKIT_BASE_URL
    );

    searchParams.set("href", href.toString());

    const url = new URL(IMAGE_ROUTE_PATH, import.meta.env.SITE);
    url.search = searchParams.toString();

    const res = await fetch(url);

    const headers = res.headers;

    const buffer = await res.blob();

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
