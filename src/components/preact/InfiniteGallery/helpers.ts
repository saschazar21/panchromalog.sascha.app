import { getCamera } from "@utils/graphql/cameras/camera";
import { getFilm } from "@utils/graphql/films/film";
import { getImages, ImagesVariables } from "@utils/graphql/images/images";
import { getLens } from "@utils/graphql/lenses/lens";
import type { GalleryState } from "@utils/hooks/useGallery";
import type { FilterState } from "@utils/hooks/useGalleryFilters";

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

export const parseParams = async (
  params: URLSearchParams
): Promise<Partial<FilterState> & { gallery: GalleryState | null }> => {
  const filters = Object.fromEntries(await fetchFilters(params));

  const variables: ImagesVariables = Object.assign(
    {},
    filters.hasOwnProperty("camera") ? { camera: filters?.camera?.model } : {},
    filters.hasOwnProperty("film") ? { film: filters?.film?.name } : {},
    filters.hasOwnProperty("lens") ? { lens: filters?.lens?.model } : {},
    params.has("cursor") ? { _cursor: params.get("cursor") as string } : {}
  );

  const gallery = await getImages(variables).then((res) => res.data?.images);

  return {
    ...filters,
    ...{ gallery: gallery ?? {} },
    cursor: variables._cursor,
  };
};
