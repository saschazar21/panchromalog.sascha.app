import type { Camera } from "@utils/graphql/cameras/camera";
import type { Film } from "@utils/graphql/films/film";
import type { Lens } from "@utils/graphql/lenses/lens";
import { useReducer } from "preact/hooks";

export enum FILTER_ACTIONS {
  RESET,
  SET_CAMERA,
  SET_CURSOR,
  SET_FILM,
  SET_LENS,
}

export interface FilterState {
  camera: Camera | null;
  cursor: string | null;
  film: Film | null;
  resetGallery: boolean;
  lens: Lens | null;
}

export interface FilterAction {
  type: FILTER_ACTIONS;
  payload: Partial<FilterState>;
}

const initialState: FilterState = {
  camera: null,
  cursor: null,
  film: null,
  lens: null,
  resetGallery: true,
};

const reducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case FILTER_ACTIONS.RESET:
      return initialState;
    case FILTER_ACTIONS.SET_CAMERA:
      return {
        ...state,
        camera: action.payload.camera!,
        cursor: null,
        resetGallery: true,
      };
    case FILTER_ACTIONS.SET_CURSOR:
      return {
        ...state,
        cursor: action.payload.cursor!,
        resetGallery: false,
      };
    case FILTER_ACTIONS.SET_FILM:
      return {
        ...state,
        cursor: null,
        film: action.payload.film!,
        resetGallery: true,
      };
    case FILTER_ACTIONS.SET_LENS:
      return {
        ...state,
        cursor: null,
        lens: action.payload.lens!,
        resetGallery: true,
      };
    default:
      return state;
  }
};

const init = (custom: Partial<FilterState>): FilterState => ({
  ...initialState,
  ...custom,
});

export const useGalleryFilters = (customInit: Partial<FilterState>) =>
  useReducer(reducer, customInit, init);
