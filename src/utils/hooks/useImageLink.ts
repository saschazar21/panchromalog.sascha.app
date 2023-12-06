import { useImageContext } from "@utils/context/ImageContext";
import { type ImageOptions, buildImageLink } from "@utils/helpers";
import { useMemo } from "preact/hooks";

export const useImageLink = (options: ImageOptions) => {
  const contextOptions = useImageContext() as ImageOptions;

  const href = useMemo(
    () =>
      new URL(
        options.href ?? contextOptions.href,
        import.meta.env.SITE
      ).toString(),
    [options?.href, contextOptions?.href]
  );

  return useMemo(
    () =>
      buildImageLink({
        ...contextOptions,
        ...options,
        href,
      }),
    [contextOptions, href, options]
  );
};

export default useImageLink;
