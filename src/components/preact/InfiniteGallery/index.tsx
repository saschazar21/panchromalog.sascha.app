import { SuspendedPictureLink } from "@components/preact/InfiniteGallery/components/SuspendedPictureLink";
import { DEFAULT_PAGE_SIZE, mapImageDataToProps } from "@utils/helpers";
import { useFilterHistory } from "@utils/hooks/useFilterHistory";
import classNames from "classnames";
import type { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import type { Gallery } from "@utils/stores/gallery";
import { Placeholder } from "./components/Placeholder";
import { useObservedGallery } from "./useObservedGallery";

import styles from "./InfiniteGallery.module.css";

export interface InfiniteGalleryProps {
  gallery?: Gallery;
}

export const InfiniteGallery: FunctionComponent<InfiniteGalleryProps> = ({
  gallery,
}) => {
  useFilterHistory();
  const {
    after: storeAfter,
    before: storeBefore,
    isIntersectingAfter,
    isIntersectingBefore,
    pictures: data,
  } = useObservedGallery(gallery);

  const [after, before] = useMemo(
    () => [
      import.meta.env.SSR ? gallery?.after : storeAfter,
      import.meta.env.SSR ? gallery?.before : storeBefore,
    ],
    [gallery, storeAfter, storeBefore]
  );

  const pictures = useMemo(
    () =>
      import.meta.env.SSR
        ? (gallery?.data ?? []).map((img) => (
            <SuspendedPictureLink
              {...mapImageDataToProps(img)}
              height={123}
              key={img.id}
              sizes="(min-width: 940px) 300px, 30vw"
              width={123}
              widths={[123, 256, 512, 600, 900]}
            />
          ))
        : data.map((props) => (
            <SuspendedPictureLink {...props} key={props.id} />
          )),
    [data, gallery]
  );

  const placeholders = useMemo(
    () =>
      new Array(DEFAULT_PAGE_SIZE)
        .fill(null)
        .map((_, i) => <Placeholder key={`placeholder-${i}`} />),
    []
  );

  const endMessage = useMemo(
    () =>
      pictures.length ? (
        <span className={styles.end}>This is the end.</span>
      ) : (
        <div className={styles.end}>
          <span>
            No images found. Try removing the filters or start over at the home
            page.
          </span>
          <br />
          <br />
          <a href={import.meta.env.SITE}>Go back to the home page.</a>
        </div>
      ),
    [pictures]
  );

  const className = classNames("button", styles.cursor);

  return (
    <div className={styles.container}>
      {before && (
        <a className={className} href={`/?cursor=${before}`} rel="prev">
          Load previous images
        </a>
      )}
      <section className={styles.gallery}>
        {isIntersectingBefore && placeholders}
        {pictures}
        {isIntersectingAfter && placeholders}
      </section>
      {after ? (
        <a className={className} href={`/?cursor=${after}`} rel="next">
          Load next images
        </a>
      ) : (
        endMessage
      )}
    </div>
  );
};
