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
  switch (action.type) {
    case FILTER_ACTIONS.RESET:
      return filters.set(initialState);
    case FILTER_ACTIONS.SET_CAMERA:
      return filters.set({
        ...filters.get(),
        camera: action.payload.camera!,
        cursor: null,
        resetGallery: true,
      });
    case FILTER_ACTIONS.SET_CURSOR:
      return filters.set({
        ...filters.get(),
        cursor: action.payload.cursor!,
        resetGallery: false,
      });
    case FILTER_ACTIONS.SET_FILM:
      return filters.set({
        ...filters.get(),
        cursor: null,
        film: action.payload.film!,
        resetGallery: true,
      });
    case FILTER_ACTIONS.SET_LENS:
      return filters.set({
        ...filters.get(),
        cursor: null,
        lens: action.payload.lens!,
        resetGallery: true,
      });
  }
};