import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import { mapImageDataToProps } from "@utils/helpers";
import { useFilters } from "@utils/hooks/useFilters";
import { useGallery } from "@utils/hooks/useGallery";
import { FILTER_ACTIONS } from "@utils/stores/filters";
import type { Gallery } from "@utils/stores/gallery";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "preact/hooks";

export enum OBSERVED_GALLERY_ACTIONS {
  RESET,
  SET_INTERSECTING_AFTER,
  SET_INTERSECTING_BEFORE,
}

export interface ObservedGalleryState {
  isIntersectingAfter: boolean;
  isIntersectingBefore: boolean;
}

export interface ObservedGalleryAction {
  payload: Partial<ObservedGalleryState>;
  type: OBSERVED_GALLERY_ACTIONS;
}

const initialState = {
  isIntersectingAfter: false,
  isIntersectingBefore: false,
};

const reducer = (
  state: ObservedGalleryState,
  action: ObservedGalleryAction
) => {
  const { payload } = action;

  switch (action.type) {
    case OBSERVED_GALLERY_ACTIONS.RESET:
      return initialState;
    case OBSERVED_GALLERY_ACTIONS.SET_INTERSECTING_AFTER:
      return {
        ...state,
        isIntersectingAfter: !!payload?.isIntersectingAfter,
      };
    case OBSERVED_GALLERY_ACTIONS.SET_INTERSECTING_BEFORE:
      return {
        ...state,
        isIntersectingBefore: !!payload?.isIntersectingBefore,
      };
    default:
      return state;
  }
};

// eslint-disable-next-line no-undef
const DEFAULT_SETTINGS: Partial<IntersectionObserverInit> = {
  root: null,
  rootMargin: "0px",
  threshold: 0.9,
};

// https://dev.to/hey_yogini/infinite-scrolling-in-react-with-intersection-observer-22fh
export const useObservedGallery = (galleryInit?: Partial<Gallery>) => {
  const { dispatch } = useFilters();
  const {
    state: { after, before, data, isLoading, mutations },
  } = useGallery(galleryInit);
  const [{ isIntersectingAfter, isIntersectingBefore }, loadingDispatch] =
    useReducer(reducer, initialState);
  const refFirst = useRef<HTMLPictureElement>(null);
  const refLast = useRef<HTMLPictureElement>(null);

  useEffect(() => {
    if (!isLoading) {
      loadingDispatch({ payload: {}, type: OBSERVED_GALLERY_ACTIONS.RESET });
    }
  }, [isLoading]);

  // eslint-disable-next-line no-undef
  const handleObserve: IntersectionObserverCallback = useCallback(
    ([el]) => {
      if (el?.isIntersecting) {
        if (el.target === refFirst.current) {
          loadingDispatch({
            payload: { isIntersectingBefore: true },
            type: OBSERVED_GALLERY_ACTIONS.SET_INTERSECTING_BEFORE,
          });
          el.target.scrollIntoView();
        }
        if (el.target === refLast.current) {
          loadingDispatch({
            payload: { isIntersectingAfter: true },
            type: OBSERVED_GALLERY_ACTIONS.SET_INTERSECTING_AFTER,
          });
        }

        let cursor = null;
        cursor = el.target === refFirst.current ? before : cursor;
        cursor = el.target === refLast.current ? after : cursor;

        cursor &&
          dispatch({
            payload: { cursor },
            type: FILTER_ACTIONS.SET_CURSOR,
          });
      }
    },
    [after, before, dispatch]
  );

  const pictures = useMemo(
    () =>
      data.map(
        (image, i): SuspendedPictureProps => ({
          ...mapImageDataToProps(image),
          height: 123,
          loading: mutations ? "lazy" : "eager",
          sizes: "(min-width: 940px) 300px, 30vw",
          width: 123,
          widths: [123, 256, 512, 600, 900],
          ...(i === 0 ? { ref: refFirst } : {}),
          ...(i === data.length - 1 ? { ref: refLast } : {}),
        })
      ),
    [data, mutations]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserve, DEFAULT_SETTINGS);
    const firstEl = refFirst.current;
    const lastEl = refLast.current;

    before && firstEl && observer.observe(firstEl);
    after && lastEl && observer.observe(lastEl);

    return () => {
      firstEl && observer.unobserve(firstEl);
      lastEl && observer.unobserve(lastEl);
    };
  }, [after, before, handleObserve, pictures]);

  return {
    after,
    before,
    isIntersectingAfter,
    isIntersectingBefore,
    pictures,
  };
};
