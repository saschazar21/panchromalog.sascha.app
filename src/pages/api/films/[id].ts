import { executeQuery } from "@utils/db/neon";
import { type Film, getFilmByIdQuery } from "@utils/db/neon/films";
import type { APIRoute } from "astro";

const DURATION_MAX_AGE = 86400;
const DURATION_STALE = 86400;

export const GET: APIRoute = async ({ params }) => {
  const [result] = await executeQuery<Film>(
    getFilmByIdQuery(params.id as string)
  );

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, s-maxage=${DURATION_MAX_AGE}, max-age=${DURATION_MAX_AGE}, stale-while-revalidate=${DURATION_STALE}`,
    },
  });
};
