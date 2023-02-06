import {
  getImages,
  ImagesVariables,
  PaginatedImages,
} from "@utils/graphql/images/images";
import {
  GalleryState,
  GALLERY_ACTIONS,
  useGallery,
} from "@utils/hooks/useGallery";
import {
  FilterAction,
  FilterState,
  useGalleryFilters,
} from "@utils/hooks/useGalleryFilters";
import { createContext, FunctionComponent } from "preact";
import { useContext, useEffect, useMemo } from "preact/hooks";

export interface GalleryContextValue
  extends Omit<FilterState, "resetGallery">,
    GalleryState {
  dispatch: (action: FilterAction) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export const useGalleryContext = () => useContext(GalleryContext);

export const GalleryContextProvider: FunctionComponent<
  { gallery: Partial<PaginatedImages> } & Partial<FilterState>
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

  const customInitialState = Object.assign(
    {},
    camera ? { camera } : {},
    cursor ? { cursor } : {},
    film ? { film } : {},
    lens ? { lens } : {}
  );

  const [filterState, filterDispatch] = useGalleryFilters(customInitialState);
  const [galleryState, galleryDispatch] = useGallery(galleryInit);

  useEffect(() => {
    galleryState.error &&
      galleryDispatch({
        type: GALLERY_ACTIONS.SET_ERROR,
        payload: { error: null },
      });
    galleryDispatch({
      type: GALLERY_ACTIONS.SET_LOADING,
      payload: { isLoading: true },
    });

    const { camera, cursor, film, lens, resetGallery } = filterState;

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
        const { before } = galleryState;

        if (resetGallery) {
          return galleryDispatch({
            type: GALLERY_ACTIONS.RESET,
            payload: data!.images,
          });
        }

        if (cursor === before) {
          return galleryDispatch({
            type: GALLERY_ACTIONS.PREPEND,
            payload: data!.images,
          });
        } else {
          return galleryDispatch({
            type: GALLERY_ACTIONS.APPEND,
            payload: data!.images,
          });
        }
      })
      .catch((error) =>
        galleryDispatch({ type: GALLERY_ACTIONS.SET_ERROR, payload: { error } })
      )
      .finally(() =>
        galleryDispatch({
          type: GALLERY_ACTIONS.SET_LOADING,
          payload: { isLoading: false },
        })
      );
  }, [filterState]);

  const value: GalleryContextValue = useMemo(
    () => ({
      dispatch: filterDispatch,
      ...filterState,
      ...galleryState,
    }),
    [filterState, galleryState]
  );

  return (
    <GalleryContext.Provider value={value} {...rest}>
      {children}
    </GalleryContext.Provider>
  );
};
