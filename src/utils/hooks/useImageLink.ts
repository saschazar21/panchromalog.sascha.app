import { useImageContext } from "@utils/context/ImageContext";
import { ImageOptions, buildImageLink } from "@utils/helpers";
import { seoConfig } from "@utils/manifest";
import { useMemo } from "preact/hooks";

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
      buildImageLink({
        ...contextOptions,
        ...options,
        href,
      }),
    [options]
  );
};
