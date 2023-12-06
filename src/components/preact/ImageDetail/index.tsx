import {
  SuspendedPicture,
  type SuspendedPictureProps,
} from "@components/preact/SuspendedPicture";
import type { Image } from "@utils/graphql/images/image";
import { getImageUrl, getPushPullFactor } from "@utils/helpers";
import type { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";

import styles from "./ImageDetail.module.css";

export interface ImageDetailProps extends Image {
  isSuspensionPrevented?: boolean;
}

export const ImageDetail: FunctionComponent<ImageDetailProps> = (props) => {
  const { description, meta, path, title } = props;

  const [dateTime, date] = useMemo(() => {
    const d = new Date(meta.date);

    return [
      meta.date.split("T")[0],
      new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d),
    ];
  }, [meta.date]);

  const shutter = useMemo(
    () => `1/${Math.round(1.0 / meta.shutter)}`,
    [meta.shutter]
  );

  const imageProps: SuspendedPictureProps = useMemo(
    () => ({
      alt: meta.alt,
      color: meta.color,
      decoding: "async",
      formats: ["avif", "webp", "jpeg"],
      height: 375,
      loading: "eager",
      sizes: "(min-width: 580px) 580px, 100vw",
      src: getImageUrl(path),
      width: 375,
      widths: [375, 580, 750, 940, 1160],
    }),
    [meta, path]
  );

  const gear = useMemo(
    () =>
      [
        [meta.camera.make, meta.camera.model, "camera"],
        ...(meta.lens ? [[meta.lens.make, meta.lens.model, "lens"]] : []),
        ...(meta.film
          ? [
              [
                meta.film.brand,
                meta.film.name,
                "film",
                getPushPullFactor(meta.film.iso, meta.iso) as string,
              ],
            ]
          : []),
      ].map(([key, value, category, extra]) => (
        <a
          key={category + value}
          className={styles.pill}
          href={`/?${category}=${encodeURIComponent(value)}`}
          data-extra={extra}
        >
          <small>{key}</small>
          <strong>{value}</strong>
        </a>
      )),
    [meta]
  );

  return (
    <article className={styles.container}>
      <SuspendedPicture
        {...imageProps}
        hash={meta.hash}
        originalHeight={meta.height}
        originalWidth={meta.width}
        className={styles.picture}
      />
      <div className={styles.info}>
        <section className={styles.meta}>
          <span>{meta.focal_length}mm</span>
          <span>f/{meta.aperture}</span>
          <span>{shutter}</span>
        </section>
        <section className={styles.content}>
          <time dateTime={dateTime}>{date}</time>
          {title && <h2 id="imagetitle">{title}</h2>}
          {description && <p id="description">{description}</p>}
        </section>
        <section className={styles.extra}>{gear}</section>
      </div>
    </article>
  );
};
