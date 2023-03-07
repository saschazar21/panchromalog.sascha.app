import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import { Camera, getCamera } from "@utils/graphql/cameras/camera";
import { getFilters } from "@utils/graphql/custom/filters";
import { Film, getFilm } from "@utils/graphql/films/film";
import type { Image } from "@utils/graphql/images/image";
import { getLens, Lens } from "@utils/graphql/lenses/lens";
import type { Filters } from "@utils/stores/filters";
import type { Gallery as GalleryState } from "@utils/stores/gallery";

export const IMAGE_API_PATH = "/api/image";

export const IMAGE_ROUTE_PATH = "/_image";

export interface ImageOptions {
  /** original image url */
  href: string;
  /** height */
  h: number;
  /** width */
  w: number;
  /** image quality */
  q?: number;
  /** format */
  f?: "avif" | "webp" | "jpeg";
  /** crop factor */
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  /** aspect ratio */
  ar?: number;
  /** image position */
  p?: string;
  /** color for alpha channel */
  bg?: string;
}

export interface FilterInit {
  cursor: string | null;
  cameras?: Camera[];
  films?: Film[];
  lenses?: Lens[];
  camera?: Camera | null;
  film?: Film | null;
  lens?: Lens | null;
}

export const DEFAULT_OPTIONS: Partial<ImageOptions> = {
  q: 80,
  f: "jpeg",
  fit: "cover",
  bg: "white",
};

export const buildImageLink = (options: ImageOptions): string => {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const searchParams = new URLSearchParams(
    opts as unknown as Record<string, string>
  );

  const url = new URL(IMAGE_ROUTE_PATH, import.meta.env.SITE);
  url.search = searchParams.toString();

  return url.toString();
};

export const fetchFilters = async (
  params: URLSearchParams
): Promise<FilterInit> => {
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

  const filters = (await (await getFilters())?.data) ?? {};

  return {
    ...Object.fromEntries(keys.filter(([_, val]) => !!val)),
    ...filters,
    cursor: params.get("cursor") ?? null,
  };
};

export const getImageUrl = (path: string) => {
  const p = path?.startsWith("/") ? path : "/" + path;

  return new URL(`/api/image${p}`, import.meta.env.SITE).toString();
};

export const mapImageDataToProps = ({
  id,
  meta,
  path,
}: Image): Omit<
  SuspendedPictureProps,
  "height" | "sizes" | "width" | "widths"
> => ({
  alt: meta.alt,
  color: meta.color,
  decoding: "async",
  formats: ["avif", "webp", "jpeg"],
  id,
  loading: "lazy",
  src: getImageUrl(path) as string,
});

export const buildParams = (state: Filters): URLSearchParams => {
  const params = [
    ...(state.camera ? [["camera", state.camera.model]] : []),
    ...(state.film ? [["film", state.film.name]] : []),
    ...(state.lens ? [["lens", state.lens.model]] : []),
    ...(state.cursor ? [["cursor", state.cursor]] : []),
  ];

  return new URLSearchParams(params);
};

export const parseParams = async (
  params: URLSearchParams
): Promise<GalleryState | null> => {
  console.log(Object.fromEntries(params));

  const search = params.toString();
  const url = new URL("/api/images", import.meta.env.SITE);
  url.search = search.toString();

  const { data: gallery, errors } = await fetch(url).then((res) => res.json());

  if (!gallery || errors?.length) {
    throw new Error(
      Array.isArray(errors)
        ? errors[0].message
        : "Failed to fetch images filtered by: " + params.toString()
    );
  }

  return gallery?.images ?? null;
};
