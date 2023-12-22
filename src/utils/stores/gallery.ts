import type { Page } from "@utils/db/sql";
import type { Image, WithImageMeta } from "@utils/db/neon/images";
import { nextPageNo, prevPageNo } from "@utils/helpers";
import { atom } from "nanostores";
import { type Filters, filters } from "./filters";

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

export interface Gallery extends Page<WithImageMeta<Image>> {
  after: number | null;
  before: number | null;
  error: Error | null;
  isLoading: boolean;
  mutations: number;
}

const initialState: Gallery = {
  after: null,
  before: null,
  data: [],
  error: null,
  isLoading: false,
  meta: {
    entries: 0,
    page: 0,
    pages: 0,
  },
  mutations: 0,
};

export const gallery = atom<Gallery>(initialState);

export const mutateGallery = (action: GalleryAction) => {
  const state = gallery.get();
  switch (action.type) {
    case GALLERY_ACTIONS.RESET:
      return gallery.set({
        ...initialState,
        ...action.payload,
      });
    case GALLERY_ACTIONS.APPEND:
      return gallery.set({
        ...state,
        ...action.payload,
        after: action.payload?.meta
          ? nextPageNo(action.payload as Page<Image>)
          : null,
        before: state.before,
        data: [...state.data, ...(action.payload.data ?? [])],
        mutations: ++state.mutations,
      });
    case GALLERY_ACTIONS.PREPEND:
      return gallery.set({
        ...state,
        ...action.payload,
        after: state.after,
        before: action.payload?.meta
          ? prevPageNo(action.payload as Page<Image>)
          : null,
        data: [...(action.payload.data ?? []), ...state.data],
        mutations: ++state.mutations,
      });
    case GALLERY_ACTIONS.SET_ERROR:
      return gallery.set({
        ...initialState,
        error: action.payload.error as Error,
      });
    case GALLERY_ACTIONS.SET_LOADING:
      return gallery.set({
        ...state,
        isLoading: action.payload.isLoading as boolean,
      });
  }
};

const galleryUpdate = ({ camera, film, lens, page, resetGallery }: Filters) => {
  const params: URLSearchParams = new URLSearchParams(
    Object.assign(
      {},
      camera ? { camera: camera.model } : {},
      page ? { page } : {},
      film ? { film: film.name } : {},
      lens ? { lens: lens.model } : {}
    )
  );

  mutateGallery({
    payload: { isLoading: true },
    type: GALLERY_ACTIONS.SET_LOADING,
  });

  const search = params.toString();
  const url = new URL("/api/images", import.meta.env.SITE);
  url.search = search.toString();

  fetch(url)
    .then((res) => res.json())
    .then((data: Page<WithImageMeta<Image>>) => {
      // if (!data && errors?.length) {
      //   throw new Error(errors[0].message);
      // }

      if (resetGallery) {
        return mutateGallery({
          payload: data,
          type: GALLERY_ACTIONS.RESET,
        });
      }

      const { before } = gallery.get();

      if (page === before) {
        return mutateGallery({
          payload: data,
          type: GALLERY_ACTIONS.PREPEND,
        });
      }

      return mutateGallery({
        payload: data,
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
