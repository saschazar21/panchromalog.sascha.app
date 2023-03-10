import { SuspendedPictureLink } from "@components/preact/InfiniteGallery/components/SuspendedPictureLink";
import type { PaginatedImages } from "@utils/graphql/images/images";
import { mapImageDataToProps } from "@utils/helpers";
import classNames from "classnames";
import type { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import { useObservedGallery } from "./useObservedGallery";

import styles from "./InfiniteGallery.module.css";

export interface InfiniteGalleryProps {
  gallery: PaginatedImages | null;
}

export const InfiniteGallery: FunctionComponent<InfiniteGalleryProps> = ({
  gallery,
}) => {
  const data = useObservedGallery(gallery ?? {});

  const pictures = useMemo(
    () =>
      data.length
        ? data.map((props) => (
            <SuspendedPictureLink {...props} key={props.id} />
          ))
        : (gallery?.data ?? []).map((img) => (
            <SuspendedPictureLink
              {...mapImageDataToProps(img)}
              height={123}
              key={img.id}
              sizes="(min-width: 940px) 300px, 30vw"
              width={123}
              widths={[123, 256, 512, 600, 900]}
            />
          )),
    [data, gallery]
  );

  const className = classNames("button", styles.cursor);

  return (
    <div className={styles.container}>
      {gallery?.before && (
        <a className={className} href={"/?cursor=" + gallery.before} rel="prev">
          Load previous images
        </a>
      )}
      <section className={styles.gallery}>{pictures}</section>
      {gallery?.after ? (
        <a className={className} href={"/?cursor=" + gallery.after} rel="next">
          Load next images
        </a>
      ) : (
        <span className={styles.end}>This is the end.</span>
      )}
    </div>
  );
};
