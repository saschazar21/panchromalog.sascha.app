import { executeQuery } from "@utils/db/neon";
import { type Lens, getLensesQuery } from "@utils/db/neon/lenses";
import { type Page, type WithSearchResult } from "@utils/db/sql";
import { parsePaginationParams } from "@utils/helpers";
import type { APIRoute } from "astro";

const DURATION_MAX_AGE = 86400;
const DURATION_STALE = 86400;

export const GET: APIRoute = async ({ url }) => {
  const { searchParams } = new URL(url);
  const mount = searchParams.get("mount");
  const searchTerm = searchParams.get("search");
  const [size, offset] = parsePaginationParams(searchParams);

  const [result] = await executeQuery<Page<WithSearchResult<Lens>>>(
    getLensesQuery({
      size,
      offset,
      searchTerm,
      mount,
    })
  );

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, s-maxage=${DURATION_MAX_AGE}, max-age=${DURATION_MAX_AGE}, stale-while-revalidate=${DURATION_STALE}`,
    },
  });
};
