import type { PaginatedImages } from "@utils/graphql/images/images";
import { useReducer } from "preact/hooks";

export enum GALLERY_ACTIONS {
  RESET,
  APPEND,
  PREPEND,
  SET_LOADING,
  SET_ERROR,
}

export interface GalleryAction {
  type: GALLERY_ACTIONS;
  payload: Partial<GalleryState>;
}

export interface GalleryState extends PaginatedImages {
  isLoading: boolean;
  error: Error | null;
}

const initialState = {
  after: null,
  before: null,
  data: [],
  error: null,
  isLoading: false,
};

const reducer = (state: GalleryState, action: GalleryAction): GalleryState => {
  switch (action.type) {
    case GALLERY_ACTIONS.RESET:
      return {
        ...initialState,
        ...action.payload,
      };
    case GALLERY_ACTIONS.APPEND:
      return {
        ...state,
        ...action.payload,
        data: [...state.data, ...(action.payload.data ?? [])],
      };
    case GALLERY_ACTIONS.PREPEND:
      return {
        ...state,
        ...action.payload,
        data: [...(action.payload.data ?? []), ...state.data],
      };
    case GALLERY_ACTIONS.SET_ERROR:
      return {
        ...initialState,
        error: action.payload.error!,
      };
    case GALLERY_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading!,
      };
    default:
      return state;
  }
};

const init = (customInit: Partial<PaginatedImages>): GalleryState => ({
  ...initialState,
  ...customInit,
});

export const useGallery = (customInit: Partial<PaginatedImages>) =>
  useReducer(reducer, customInit, init);
