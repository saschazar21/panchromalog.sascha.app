import type { FunctionComponent } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import type { HTMLAttributes } from "preact/compat";
import { SuspendedImage } from "@components/preact/SuspendedImage";
import { useImageLink } from "@utils/hooks/useImageLink";

export interface SuspendedPictureProps
  extends HTMLAttributes<HTMLImageElement> {
  formats?: Array<"avif" | "webp" | "jpeg">;
  height: number;
  sizes: string;
  src: string;
  width: number;
  widths?: number[];
}

export const SuspendedPicture: FunctionComponent<SuspendedPictureProps> = (
  props
) => {
  const { formats = ["jpeg"], sizes, widths = [], ...rest } = props;

  const sourceSet = useCallback(
    (format: string) =>
      widths
        .map((w) => {
          const { height, width, src } = props;
          const ratio = w / width;
          const url = useImageLink({
            f: format as "avif" | "webp" | "jpeg",
            h: Math.floor(height * ratio),
            href: src,
            w: Math.floor(width * ratio),
          });

          return [url, w + "w"].join(" ");
        })
        .join(", "),
    [widths]
  );

  const sources = useMemo(
    () =>
      formats.map((format) => (
        <source
          key={props.src + format}
          type={"image/" + format}
          sizes={sizes}
          srcset={sourceSet(format)}
        />
      )),
    [formats]
  );

  return (
    <picture>
      {sources}
      <SuspendedImage {...rest} />
    </picture>
  );
};
