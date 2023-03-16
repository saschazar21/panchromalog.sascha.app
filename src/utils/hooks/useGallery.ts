import { useStore } from "@nanostores/preact";
import {
  Gallery,
  gallery,
  GALLERY_ACTIONS,
  mutateGallery,
} from "@utils/stores/gallery";
import { useEffect } from "preact/hooks";

export const useGallery = (galleryInit?: Partial<Gallery>) => {
  const state = useStore(gallery);
  const dispatch = mutateGallery;

  useEffect(() => {
    galleryInit &&
      dispatch({
        payload: galleryInit,
        type: GALLERY_ACTIONS.RESET,
      });
  }, [dispatch, galleryInit]);

  return {
    dispatch,
    state,
  };
};
