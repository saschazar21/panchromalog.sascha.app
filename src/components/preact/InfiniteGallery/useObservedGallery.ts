import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import { useFilters } from "@utils/hooks/useFilters";
import { useGallery } from "@utils/hooks/useGallery";
import { FILTER_ACTIONS } from "@utils/stores/filters";
import type { Gallery } from "@utils/stores/gallery";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";

const IMAGE_API_PATH = "/api/image/";

const DEFAULT_SETTINGS: Partial<IntersectionObserverInit> = {
  root: null,
  rootMargin: "0px",
  threshold: 0.9,
};

export const useObservedGallery = (galleryInit?: Partial<Gallery>) => {
  const { dispatch } = useFilters();
  const {
    state: { after, before, data },
  } = useGallery(galleryInit);
  const refFirst = useRef<HTMLPictureElement>(null);
  const refLast = useRef<HTMLPictureElement>(null);

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
    [after, before]
  );

  const observer = new IntersectionObserver(handleObserve, DEFAULT_SETTINGS);

  const pictures = useMemo(
    () =>
      data.map(
        ({ id, meta, path }, i): SuspendedPictureProps => ({
          alt: meta.alt,
          decoding: "async",
          formats: ["avif", "webp", "jpeg"],
          height: 256,
          id: id,
          loading: "lazy",
          sizes: "(min-width: 940px) 300px, 30vw",
          src: IMAGE_API_PATH + path,
          width: 256,
          widths: [256, 256, 512, 600, 900],
          ...(i === 0 ? { ref: refFirst } : {}),
          ...(i === data.length - 1 ? { ref: refLast } : {}),
        })
      ),
    [data]
  );

  useEffect(() => {
    if (observer) {
      before && refFirst.current && observer.observe(refFirst.current);
      after && refLast.current && observer.observe(refLast.current);

      return () => {
        refFirst.current && observer.unobserve(refFirst.current);
        refLast.current && observer.unobserve(refLast.current);
      };
    }
  }, [after, before, pictures]);

  return pictures;
};
