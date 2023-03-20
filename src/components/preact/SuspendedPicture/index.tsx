import { useCallback, useMemo, useState } from "preact/hooks";
import { forwardRef, lazy, HTMLAttributes, Suspense } from "preact/compat";
import { SuspendedImage } from "@components/preact/SuspendedImage";
import { buildImageLink } from "@utils/helpers";
import classNames from "classnames";

import styles from "./SuspendedPicture.module.css";

const Blurhash = lazy(() =>
  import("@components/preact/Blurhash").then(
    ({ Blurhash: Component }) => Component
  )
);

export interface SuspendedPictureProps
  extends Omit<HTMLAttributes<HTMLImageElement>, "ref"> {
  color?: string;
  formats?: Array<"avif" | "webp" | "jpeg">;
  hash?: string;
  height: number;
  originalHeight?: number;
  originalWidth?: number;
  sizes: string;
  src: string;
  width: number;
  widths?: number[];
}

export const SuspendedPicture = forwardRef<
  HTMLPictureElement,
  SuspendedPictureProps
>((props, ref) => {
  const {
    formats = ["jpeg"],
    originalHeight,
    originalWidth,
    sizes,
    widths = [],
    ...rest
  } = props;
  const { height, width, src } = props;
  const [isLoaded, setIsLoaded] = useState(true);

  const handleOnLoaded = useCallback(
    (value: boolean) => setIsLoaded(value),
    []
  );

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

  const className = classNames(styles.wrapper, rest.className as string);

  return (
    <div
      className={className}
      height={rest.height}
      width={rest.width}
      style={{ "--bg-color": rest.color ?? "var(--color-shadow)" }}
    >
      {!isLoaded && rest.hash && (
        <Suspense fallback={null}>
          <Blurhash
            hash={rest.hash}
            height={originalHeight as number}
            width={originalWidth as number}
          />
        </Suspense>
      )}
      <picture ref={ref}>
        {sources}
        <SuspendedImage {...rest} onLoaded={handleOnLoaded} />
      </picture>
    </div>
  );
});
