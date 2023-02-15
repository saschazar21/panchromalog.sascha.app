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
        !import.meta.env.SSR && window.history.pushState({}, "", url);
      }
    },
    [props]
  );

  const handleOnClose = useCallback(() => {
    setImageDetailProps(null);
  }, []);

  return (
    <>
      <a href={"/p/" + props.id} onClick={handleOnClick}>
        <SuspendedPicture {...props!} ref={ref} />
      </a>
      {imageDetailProps && (
        <Modal onClose={handleOnClose}>
          <ImageDetail {...imageDetailProps} />
        </Modal>
      )}
    </>
  );
});
