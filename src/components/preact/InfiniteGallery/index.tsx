import { SuspendedPicture } from "@components/preact/SuspendedPicture";
import type { PaginatedImages } from "@utils/graphql/images/images";
import classNames from "classnames";
import type { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import { useObservedGallery } from "./useObservedGallery";

import styles from "./InfiniteGallery.module.css";
import { mapImageDataToProps } from "./helpers";

export interface InfiniteGalleryProps {
  gallery: PaginatedImages | null;
}

export const InfiniteGallery: FunctionComponent<InfiniteGalleryProps> = ({
  gallery,
}) => {
  const data = useObservedGallery(gallery ?? {});

  const noScriptImages = useMemo(() => {
    if (gallery?.data?.length) {
      return gallery.data.map((img) => (
        <a href={"/p/" + img.id}>
          <SuspendedPicture
            {...mapImageDataToProps(img)}
            decoding="async"
            isSuspensionPrevented={true}
          />
        </a>
      ));
    }
  }, []);

  const pictures = useMemo(
    () =>
      data.map((props) => (
        <a href={"/p/" + props.id} key={props.id}>
          <SuspendedPicture {...props} />
        </a>
      )),
    [data]
  );

  const className = classNames("button", styles.cursor);

  return (
    <>
      <noscript className={styles.noscript}>
        {gallery?.before && (
          <a className={className} href={"/?cursor=" + gallery.before}>
            Load previous images
          </a>
        )}
        <section className={styles.gallery}>{noScriptImages}</section>
        {gallery?.after && (
          <a className={className} href={"/?cursor=" + gallery.after}>
            Load next images
          </a>
        )}
      </noscript>
      <section className={styles.gallery}>{pictures}</section>
      <span className={styles.end}>This is the end.</span>
    </>
  );
};
