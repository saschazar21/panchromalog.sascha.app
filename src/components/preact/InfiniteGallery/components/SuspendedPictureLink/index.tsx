import { ImageDetail } from "@components/preact/ImageDetail";
import { Modal } from "@components/preact/Modal";
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

        const url = new URL(`/p/${props.id}`, import.meta.env.SITE);
        !import.meta.env.SSR &&
          window.history.pushState({ id: props.id }, "", url);
      }
    },
    [imageData, props.id]
  );

  const handleOnClose = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setImageDetailProps(null);

    !import.meta.env.SSR && window.history.back();
  }, []);

  return (
    <>
      <a
        href={`/p/${props.id}`}
        onClick={handleOnClick}
        target="_blank"
        rel="opener noreferrer"
      >
        <SuspendedPicture
          {...props}
          hash={imageData?.meta.hash}
          originalHeight={imageData?.meta.height}
          originalWidth={imageData?.meta.width}
          ref={ref}
        />
      </a>
      {imageDetailProps && (
        <Modal
          onClose={handleOnClose}
          className={styles.modal}
          role="dialog"
          aria-describedby={
            imageDetailProps.description ? "description" : undefined
          }
          aria-labelledby={imageDetailProps.title ? "imagetitle" : undefined}
          modalControls={
            <a
              href={`/p/${imageDetailProps.id}`}
              target="_blank"
              rel="opener noreferrer"
              className={styles.detailLink}
            >
              View image details
            </a>
          }
        >
          <ImageDetail {...imageDetailProps} />
        </Modal>
      )}
    </>
  );
});
