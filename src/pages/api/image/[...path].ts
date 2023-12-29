import type { APIRoute } from "astro";

if (!import.meta.env.IMAGEKIT_ID) {
  throw new Error("ERROR: IMAGEKIT_ID env not defined!");
}

export interface ImageKitOptions {
  c?: "maintain_ratio";
  f?: "avif" | "webp" | "jpeg";
  h?: number;
  w?: number;
  q?: number;
}

const IMAGEKIT_BASE_URL = "https://ik.imagekit.io";
const CACHE_DURATION = 3.15576e7;

export const GET: APIRoute = async ({
  params,
  url: currentUrl,
}): Promise<Response> => {
  const { path } = params;
  const { searchParams } = new URL(currentUrl);

  try {
    const params = new Map<string, string | number>();
    params.set("q", (searchParams.get("q") as unknown as number) ?? 80);
    params.set("f", searchParams.get("f") as unknown as string);
    params.set("h", searchParams.get("h") as unknown as number);
    params.set("w", searchParams.get("w") as unknown as number);
    params.set("c", "maintain_ratio");
    // params.set("fo", "auto");

    const transforms = `tr:${Array.from(params)
      .map(([key, val]) => `${key}-${val}`)
      .join(",")}`;

    const url = new URL(
      `/${import.meta.env.IMAGEKIT_ID}/${transforms}/${path}`,
      IMAGEKIT_BASE_URL
    );

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
