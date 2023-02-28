import type { Camera } from "@utils/graphql/cameras/camera";
import type { Film } from "@utils/graphql/films/film";
import type { Lens } from "@utils/graphql/lenses/lens";
import { atom } from "nanostores";

export enum FILTER_ACTIONS {
  RESET,
  SET_CAMERA,
  SET_CURSOR,
  SET_FILM,
  SET_LENS,
}

export interface Filters {
  camera: Camera | null;
  cursor: string | null;
  film: Film | null;
  lens: Lens | null;
  resetGallery: boolean;
}

export interface FilterAction {
  payload: Partial<Filters>;
  type: FILTER_ACTIONS;
}

const initialState = {
  camera: null,
  cursor: null,
  film: null,
  lens: null,
  resetGallery: true,
};

export const filters = atom<Filters>(initialState);

export const mutateFilters = (action: FilterAction) => {
  const state = filters.get();
  switch (action.type) {
    case FILTER_ACTIONS.RESET:
      return filters.set({
        ...initialState,
        ...action.payload,
      });
    case FILTER_ACTIONS.SET_CAMERA:
      return filters.set({
        ...state,
        camera: action.payload.camera as Camera,
        cursor: null,
        resetGallery: true,
      });
    case FILTER_ACTIONS.SET_CURSOR:
      return filters.set({
        ...state,
        cursor: action.payload.cursor as string,
        resetGallery: false,
      });
    case FILTER_ACTIONS.SET_FILM:
      return filters.set({
        ...state,
        cursor: null,
        film: action.payload.film as Film,
        resetGallery: true,
      });
    case FILTER_ACTIONS.SET_LENS:
      return filters.set({
        ...state,
        cursor: null,
        lens: action.payload.lens as Lens,
        resetGallery: true,
      });
  }
};
