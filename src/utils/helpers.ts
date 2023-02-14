import { getCamera } from "@utils/graphql/cameras/camera";
import { getFilm } from "@utils/graphql/films/film";
import { getLens } from "@utils/graphql/lenses/lens";
import type { Gallery as GalleryState } from "@utils/stores/gallery";
import type { Filters as FilterState } from "@utils/stores/filters";

const fetchFilters = async (params: URLSearchParams) => {
  const keys = [];

  if (params.has("camera")) {
    keys.push([
      "camera",
      (await (
        await getCamera({ model: params.get("camera") as string })
      )?.data?.camera) ?? null,
    ]);
  }
  if (params.has("film")) {
    keys.push([
      "film",
      (await (
        await getFilm({ name: params.get("film") as string })
      )?.data?.film) ?? null,
    ]);
  }
  if (params.has("lens")) {
    keys.push([
      "lens",
      (await (
        await getLens({ model: params.get("lens") as string })
      )?.data?.lens) ?? null,
    ]);
  }

  return keys.filter(([_, val]) => !!val);
};

export const getImageUrl = (path: string) => {
  const p = path.startsWith("/") ? path : "/" + path;

  return new URL(`/api/image${p}`, import.meta.env.SITE).toString();
};

export const parseParams = async (
  params: URLSearchParams
): Promise<Partial<FilterState> & { gallery: GalleryState | null }> => {
  const filters = Object.fromEntries(await fetchFilters(params));

  const search = params.toString();
  const url = new URL("/api/images", import.meta.env.SITE);
  url.search = search.toString();

  const { data: gallery, errors } = await fetch(url).then((res) => res.json());

  return {
    ...filters,
    gallery: gallery?.images ?? { error: new Error(errors[0].message) },
    cursor: params.get("cursor"),
  };
};
