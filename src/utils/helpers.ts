import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import type { Filters } from "@utils/stores/filters";
import type { Gallery as GalleryState } from "@utils/stores/gallery";
import {
  getCameraByIdQuery,
  type Camera,
  getCamerasQuery,
} from "./db/neon/cameras";
import { getFilmByIdQuery, type Film, getFilmsQuery } from "./db/neon/films";
import { getLensByIdQuery, getLensesQuery, type Lens } from "./db/neon/lenses";
import type { Image, WithImageMeta } from "./db/neon/images";
import { executeTransaction } from "./db/neon";
import type { Page } from "./db/sql";

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

export const DEFAULT_PAGE_SIZE = 10;

export const IMAGE_API_PATH = "/api/image";

export const IMAGE_ROUTE_PATH = "/_image";

export const DEFAULT_OPTIONS: Partial<ImageOptions> = {
  q: 80,
  f: "jpeg",
  fit: "cover",
  bg: "white",
};

export const ISO_MAP = new Map<number, Map<number, string>>([
  [
    50,
    new Map<number, string>([
      [100, "+1"],
      [125, "+1¼"],
      [160, "+1⅔"],
      [200, "+2"],
      [400, "+3"],
    ]),
  ],
  [
    100,
    new Map<number, string>([
      [50, "-1"],
      [125, "+⅓"],
      [160, "+¾"],
      [200, "+1"],
      [400, "+2"],
      [800, "+3"],
    ]),
  ],
  [
    125,
    new Map<number, string>([
      [50, "-1¼"],
      [100, "-¼"],
      [160, "+⅓"],
      [200, "+¾"],
      [400, "+2"],
      [800, "+3"],
    ]),
  ],
  [
    160,
    new Map<number, string>([
      [50, "-1⅔"],
      [100, "-⅔"],
      [125, "-⅓"],
      [200, "+⅓"],
      [400, "+1⅓"],
      [800, "+2½"],
    ]),
  ],
  [
    200,
    new Map<number, string>([
      [50, "-2"],
      [100, "-1"],
      [125, "-¾"],
      [160, "-⅔"],
      [400, "+1"],
      [800, "+2"],
      [1600, "+3"],
    ]),
  ],
  [
    400,
    new Map<number, string>([
      [100, "-2"],
      [125, "-1⅔"],
      [160, "-1⅓"],
      [200, "-1"],
      [800, "+1"],
      [1600, "+2"],
      [3200, "+3"],
    ]),
  ],
  [
    800,
    new Map<number, string>([
      [200, "-2"],
      [400, "-1"],
      [1600, "+1"],
      [3200, "+2"],
    ]),
  ],
]);

export const buildImageLink = (options: ImageOptions): string => {
  const { href, ...opts } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const originalUrl = new URL(href);

  const isImageFromCDN =
    originalUrl.origin === import.meta.env.SITE &&
    originalUrl.pathname.startsWith(IMAGE_API_PATH);

  const searchParams = new URLSearchParams({
    ...opts,
    ...(!isImageFromCDN ? { href } : {}),
  } as unknown as Record<string, string>);

  const url = isImageFromCDN
    ? originalUrl
    : new URL(IMAGE_ROUTE_PATH, import.meta.env.SITE);
  url.search = searchParams.toString();

  return url.toString();
};

export const fetchFilters = async (
  params: URLSearchParams
): Promise<FilterInit> => {
  const keys = [];

  if (
    [params.get("camera"), params.get("film"), params.get("lens")].some(
      (param) => param?.length
    )
  ) {
    const [[camera], [film], [lens]] = await executeTransaction<
      [[Camera], [Film], [Lens]]
    >([
      getCameraByIdQuery(params.get("camera") as string),
      getFilmByIdQuery(params.get("film") as string),
      getLensByIdQuery(params.get("lens") as string),
    ]);

    if (camera) {
      keys.push(["camera", camera]);
    }
    if (film) {
      keys.push(["film", film]);
    }
    if (lens) {
      keys.push(["lens", lens]);
    }
  }

  const size = 25;

  const [[camerasPage], [filmsPage], [lensesPage]] = await executeTransaction<
    [[Page<Camera>], [Page<Film>], [Page<Lens>]]
  >([
    getCamerasQuery({ size, offset: 0, searchTerm: null, mount: null }),
    getFilmsQuery({ size, offset: 0, searchTerm: null, type: null }),
    getLensesQuery({ size, offset: 0, searchTerm: null, mount: null }),
  ]);

  const { data: cameras = [] } = camerasPage ?? {};
  const { data: films = [] } = filmsPage ?? {};
  const { data: lenses = [] } = lensesPage ?? {};

  const filters = { cameras, films, lenses };

  return {
    ...Object.fromEntries(keys.filter(([_, val]) => !!val)),
    ...filters,
    page: params.get("page") ?? null,
  };
};

export const getImageUrl = (path: string) => {
  const p = path?.startsWith("/") ? path : `/${path}`;

  return new URL(`/api/image${p}`, import.meta.env.SITE).toString();
};

export const mapImageDataToProps = ({
  id,
  meta,
  path,
}: WithImageMeta<Image>): Omit<
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
    ...(state.page ? [["page", state.page.toString()]] : []),
  ];

  return new URLSearchParams(params);
};

export const parseParams = async (
  params: URLSearchParams
): Promise<GalleryState | undefined> => {
  const search = params.toString();
  const url = new URL("/api/images", import.meta.env.SITE);
  url.search = search.toString();

  const images: Page<WithImageMeta<Image>> | null = await fetch(url).then(
    (res) => res.json()
  );

  if (!images?.data) {
    return undefined;
  }

  const meta = images.meta;

  const gallery: GalleryState = {
    after: meta.page < meta.pages ? meta.page + 1 : null,
    before: meta.page > 1 ? meta.page - 1 : null,
    error: null,
    data: images.data,
    isLoading: false,
    meta,
    mutations: 0,
  };

  return gallery;
};

export const getPushPullFactor = (box: number, iso: number): string | null => {
  return ISO_MAP.has(box) ? ISO_MAP.get(box)?.get(iso) ?? null : null;
};

export const parsePaginationParams = (params: URLSearchParams) => {
  const parsedPage = parseInt(params.get("page") ?? "", 10);
  const parsedSize = parseInt(params.get("size") ?? "", 10);

  const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 0;
  const size =
    !isNaN(parsedSize) && parsedSize > 0 ? parsedSize : DEFAULT_PAGE_SIZE;
  const offset = (page > 0 ? page - 1 : 0) * size;

  return [size, offset];
};
