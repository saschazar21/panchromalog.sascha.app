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

export const IMAGE_ROUTE_PATH = "/_image";

export const getImageURL = (opts: ImageOptions): string => {
  const params = new URLSearchParams(opts as unknown as Record<string, string>);
  return `${IMAGE_ROUTE_PATH}?${params.toString()}`;
};
