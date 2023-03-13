import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import { mapImageDataToProps } from "@utils/helpers";
import { useFilters } from "@utils/hooks/useFilters";
import { useGallery } from "@utils/hooks/useGallery";
import { FILTER_ACTIONS } from "@utils/stores/filters";
import type { Gallery } from "@utils/stores/gallery";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";

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
    state: { after, before, data, mutations },
  } = useGallery(galleryInit);
  const refFirst = useRef<HTMLPictureElement>(null);
  const refLast = useRef<HTMLPictureElement>(null);

  // eslint-disable-next-line no-undef
  const handleObserve: IntersectionObserverCallback = useCallback(
    ([el]) => {
      if (el?.isIntersecting) {
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

  return pictures;
};
