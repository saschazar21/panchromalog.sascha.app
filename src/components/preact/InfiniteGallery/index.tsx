import type { PaginatedImages } from "@utils/graphql/images/images";
import type { FunctionComponent } from "preact";
import { useMemo, useRef } from "preact/hooks";
import { useObservedGallery } from "./useObservedGallery";

import styles from "./InfiniteGallery.module.css";
import { SuspendedPicture } from "../SuspendedPicture";

export interface InfiniteGalleryProps {
  gallery: PaginatedImages | null;
}

// https://dev.to/hey_yogini/infinite-scrolling-in-react-with-intersection-observer-22fh
export const InfiniteGallery: FunctionComponent<InfiniteGalleryProps> = ({
  gallery,
}) => {
  const data = useObservedGallery(gallery ?? {});

  const pictures = useMemo(
    () =>
      data.map((props) => (
        <a href={"/p/" + props.id} key={props.id}>
          <SuspendedPicture {...props} />
        </a>
      )),
    [data]
  );

  return <section className={styles.gallery}>{pictures}</section>;
};
