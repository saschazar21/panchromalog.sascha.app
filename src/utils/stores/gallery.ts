import {
  getImages,
  ImagesVariables,
  PaginatedImages,
} from "@utils/graphql/images/images";
import { atom } from "nanostores";
import { Filters, filters } from "./filters";

export enum GALLERY_ACTIONS {
  RESET,
  APPEND,
  PREPEND,
  SET_ERROR,
  SET_LOADING,
}

export interface GalleryAction {
  payload: Partial<Gallery>;
  type: GALLERY_ACTIONS;
}

export interface Gallery extends PaginatedImages {
  error: Error | null;
  isLoading: boolean;
}

const initialState: Gallery = {
  after: null,
  before: null,
  data: [],
  error: null,
  isLoading: false,
};

export const gallery = atom<Gallery>(initialState);

export const mutateGallery = (action: GalleryAction) => {
  switch (action.type) {
    case GALLERY_ACTIONS.RESET:
      return gallery.set({
        ...initialState,
        ...action.payload,
      });
    case GALLERY_ACTIONS.APPEND:
      return gallery.set({
        ...gallery.get(),
        ...action.payload,
        data: [...gallery.get().data, ...action.payload.data!],
      });
    case GALLERY_ACTIONS.PREPEND:
      return gallery.set({
        ...gallery.get(),
        ...action.payload,
        data: [...action.payload.data!, ...gallery.get().data],
      });
    case GALLERY_ACTIONS.SET_ERROR:
      return gallery.set({
        ...initialState,
        error: action.payload.error!,
      });
    case GALLERY_ACTIONS.SET_LOADING:
      return gallery.set({
        ...gallery.get(),
        isLoading: action.payload.isLoading!,
      });
  }
};

const galleryUpdate = ({
  camera,
  cursor,
  film,
  lens,
  resetGallery,
}: Filters) => {
  const variables: ImagesVariables = Object.assign(
    {},
    camera ? { camera: camera.model } : {},
    cursor ? { _cursor: cursor } : {},
    film ? { film: film.name } : {},
    lens ? { lens: lens.model } : {}
  );

  mutateGallery({
    payload: { isLoading: true },
    type: GALLERY_ACTIONS.SET_LOADING,
  });

  getImages(variables)
    .then(({ data, errors }) => {
      if (!data || errors?.length) {
        throw new Error(
          errors
            ? errors[0].message
            : "Something went wrong while fetching the images."
        );
      }

      if (resetGallery) {
        return mutateGallery({
          payload: data.images,
          type: GALLERY_ACTIONS.RESET,
        });
      }

      const { before } = gallery.get();

      if (cursor === before) {
        return mutateGallery({
          payload: data.images,
          type: GALLERY_ACTIONS.PREPEND,
        });
      }

      return mutateGallery({
        payload: data.images,
        type: GALLERY_ACTIONS.APPEND,
      });
    })
    .catch((e) =>
      mutateGallery({
        payload: { error: e as Error },
        type: GALLERY_ACTIONS.SET_ERROR,
      })
    )
    .finally(() =>
      mutateGallery({
        payload: { isLoading: false },
        type: GALLERY_ACTIONS.SET_LOADING,
      })
    );
};

filters.listen(galleryUpdate);
