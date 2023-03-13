import { getLenses } from "@utils/graphql/lenses/lenses";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ url }) => {
  const { searchParams } = new URL(url);
  const mount = searchParams.get("mount");

  const res = await getLenses(mount ? { mount } : undefined);

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      pragma: "no-cache",
    },
  });
};
