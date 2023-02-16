import { ImageDetail } from "@components/preact/ImageDetail";
import { Modal } from "@components/preact/Modal";
import { CloseButton } from "@components/preact/Modal/components/CloseButton";
import {
  SuspendedPicture,
  SuspendedPictureProps,
} from "@components/preact/SuspendedPicture";
import { useStore } from "@nanostores/preact";
import type { Image } from "@utils/graphql/images/image";
import { gallery } from "@utils/stores/gallery";
import { forwardRef } from "preact/compat";
import { useCallback, useMemo, useState } from "preact/hooks";

import styles from "./SuspendedPictureLink.module.css";

export const SuspendedPictureLink = forwardRef<
  HTMLPictureElement,
  SuspendedPictureProps
>((props, ref) => {
  const [imageDetailProps, setImageDetailProps] = useState<Image | null>(null);
  const { data } = useStore(gallery);

  const imageData = useMemo(
    () => data.find(({ id: currentId }) => currentId === props.id),
    [data, props.id]
  );

  const handleOnClick = useCallback(
    (e: Event) => {
      if (imageData) {
        e.preventDefault();

        setImageDetailProps(imageData);

        const url = new URL("/p/" + props.id, import.meta.env.SITE);
        !import.meta.env.SSR &&
          window.history.pushState({ id: props.id }, "", url);
      }
    },
    [props]
  );

  const handleOnClose = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setImageDetailProps(null);

    !import.meta.env.SSR && window.history.back();
  }, []);

  return (
    <>
      <a
        href={"/p/" + props.id}
        onClick={handleOnClick}
        target="_blank"
        rel="opener"
      >
        <SuspendedPicture {...props} ref={ref} />
      </a>
      {imageDetailProps && (
        <Modal onClose={handleOnClose} className={styles.modal}>
          <div className={styles.modalControls}>
            <a
              href={"/p/" + imageDetailProps.id}
              target="_blank"
              rel="opener"
              className={styles.detailLink}
            >
              View image details
            </a>
            <CloseButton
              onClick={handleOnClose}
              className={styles.closeButton}
            />
          </div>
          <ImageDetail {...imageDetailProps} />
        </Modal>
      )}
    </>
  );
});
