import { useStore } from "@nanostores/preact";
import { Gallery, gallery as galleryStore } from "@utils/stores/gallery";
import { useEffect } from "preact/hooks";

export const useGallery = (galleryInit: Partial<Gallery> = {}) => {
  const gallery = useStore(galleryStore);

  useEffect(() => {
    galleryStore.set({
      ...galleryStore.get(),
      ...galleryInit,
    });
  }, []);

  return gallery;
};
