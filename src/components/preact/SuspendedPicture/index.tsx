import { useCallback, useMemo } from "preact/hooks";
import { forwardRef, HTMLAttributes } from "preact/compat";
import { SuspendedImage } from "@components/preact/SuspendedImage";
import { buildImageLink } from "@utils/helpers";

export interface SuspendedPictureProps
  extends Omit<HTMLAttributes<HTMLImageElement>, "ref"> {
  color?: string;
  formats?: Array<"avif" | "webp" | "jpeg">;
  height: number;
  sizes: string;
  src: string;
  width: number;
  widths?: number[];
}

export const SuspendedPicture = forwardRef<
  HTMLPictureElement,
  SuspendedPictureProps
>((props, ref) => {
  const { color, formats = ["jpeg"], sizes, widths = [], ...rest } = props;
  const { height, width, src } = props;

  const sourceSet = useCallback(
    (format: string) =>
      widths
        .map((w) => {
          const ratio = w / width;
          const url = buildImageLink({
            f: format as "avif" | "webp" | "jpeg",
            h: Math.floor(height * ratio),
            href: new URL(src, import.meta.env.SITE).toString(),
            w: Math.floor(width * ratio),
          });

          return [url, `${w}w`].join(" ");
        })
        .join(", "),
    [height, src, width, widths]
  );

  const sources = useMemo(
    () =>
      formats.map((format) => (
        <source
          key={props.src + format}
          type={`image/${format}`}
          sizes={sizes}
          srcset={sourceSet(format)}
        />
      )),
    [formats, props.src, sizes, sourceSet]
  );

  return (
    <picture ref={ref} style={{ "--bg-color": color ?? "var(--color-shadow)" }}>
      {sources}
      <SuspendedImage {...rest} />
    </picture>
  );
});
