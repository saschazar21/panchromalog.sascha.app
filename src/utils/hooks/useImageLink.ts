import { useImageContext } from "@utils/context/ImageContext";
import { seoConfig } from "@utils/manifest";
import { useMemo } from "preact/hooks";

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

export const DEFAULT_OPTIONS: Partial<ImageOptions> = {
  q: 80,
  f: "jpeg",
  fit: "cover",
  bg: "white",
};

export const IMAGE_ROUTE_PATH = "/_image";

export const getImageURL = (opts: ImageOptions): string => {
  const params = new URLSearchParams(opts as unknown as Record<string, string>);
  return `${IMAGE_ROUTE_PATH}?${params.toString()}`;
};

export const useImageLink = (options: ImageOptions) => {
  const contextOptions = (useImageContext() as ImageOptions) ?? {};

  const href = useMemo(
    () =>
      new URL(
        options.href ?? contextOptions.href,
        seoConfig.baseURL
      ).toString(),
    [options.href, contextOptions.href]
  );

  return useMemo(
    () =>
      getImageURL({
        ...DEFAULT_OPTIONS,
        ...contextOptions,
        ...options,
        href,
      }),
    [options]
  );
};
