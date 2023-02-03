import type { Camera } from "@utils/graphql/cameras/camera";
import type { Film } from "@utils/graphql/films/film";
import {
  getImages,
  ImagesVariables,
  PaginatedImages,
} from "@utils/graphql/images/images";
import type { Lens } from "@utils/graphql/lenses/lens";
import { createContext, FunctionComponent } from "preact";
import { useEffect, useReducer, useState } from "preact/hooks";

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

export interface GalleryContextValue extends Omit<FilterState, "resetGallery"> {
  dispatch: (action: FilterAction) => void;
  error: Error | null;
  gallery: PaginatedImages;
  loading: boolean;
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

const init = (custom: Partial<FilterState>): FilterState => {
  return {
    ...initialState,
    ...custom,
  };
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export const GalleryContextProvider: FunctionComponent<
  { gallery: PaginatedImages } & Partial<FilterState>
> = (props) => {
  const {
    gallery: galleryInit,
    camera,
    children,
    cursor,
    film,
    lens,
    ...rest
  } = props;

  const [error, setError] = useState<Error | null>(null);
  const [gallery, setGallery] = useState(galleryInit);
  const [loading, setLoading] = useState(false);

  const customInitialState = Object.assign(
    {},
    camera ? { camera } : {},
    cursor ? { cursor } : {},
    film ? { film } : {},
    lens ? { lens } : {}
  );

  const [state, dispatch] = useReducer(reducer, customInitialState, init);

  useEffect(() => {
    setError(null);
    setLoading(true);

    const { camera, cursor, film, lens, resetGallery } = state;

    const variables: ImagesVariables = Object.assign(
      {},
      camera ? { camera: camera.model } : {},
      cursor ? { _cursor: cursor } : {},
      film ? { film: film.name } : {},
      lens ? { lens: lens.model } : {}
    );

    getImages(variables)
      .then(({ data, errors }) => {
        if (errors?.length) {
          throw new Error(errors[0].message);
        }

        setGallery((current) => {
          const { after, data: currentGallery } = current;

          if (resetGallery) {
            return data as PaginatedImages;
          }

          if (cursor === after) {
            return {
              ...data,
              data: [...currentGallery, ...data!.data],
            } as PaginatedImages;
          } else {
            return {
              ...data,
              data: [...data!.data, ...currentGallery],
            } as PaginatedImages;
          }
        });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [state]);

  const value: GalleryContextValue = {
    dispatch,
    ...state,
    error,
    loading,
    gallery,
  };

  return (
    <GalleryContext.Provider value={value} {...rest}>
      {children}
    </GalleryContext.Provider>
  );
};
