import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import { useFilters } from "@utils/hooks/useFilters";
import { useGallery } from "@utils/hooks/useGallery";
import { FILTER_ACTIONS } from "@utils/stores/filters";
import type { Gallery } from "@utils/stores/gallery";
import { createRef } from "preact";
import { Ref, useCallback, useEffect, useMemo, useRef } from "preact/hooks";

const IMAGE_API_PATH = "/api/image/";

const DEFAULT_SETTINGS: Partial<IntersectionObserverInit> = {
  root: null,
  rootMargin: "0px",
  threshold: 0.9,
};

export const useObservedGallery = (
  ref: Ref<HTMLDivElement>,
  galleryInit?: Partial<Gallery>
) => {
  const { dispatch } = useFilters();
  const {
    state: { after, before, data },
  } = useGallery(galleryInit);
  const refFirst = useRef<HTMLPictureElement | null>(null);
  const refLast = useRef<HTMLPictureElement | null>(null);
  const observer = createRef<IntersectionObserver>();

  useEffect(() => {
    if (ref.current) {
      observer.current = new IntersectionObserver(handleObserve, {
        ...DEFAULT_SETTINGS,
        root: ref.current,
      });
    }
  }, [ref]);

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

  const handleObserve: IntersectionObserverCallback = useCallback(
    ([first, last]) => {
      console.log(first, last);
      if (first.isIntersecting) {
        dispatch({
          payload: { cursor: before },
          type: FILTER_ACTIONS.SET_CURSOR,
        });
      }

      if (last.isIntersecting) {
        dispatch({
          payload: { cursor: after },
          type: FILTER_ACTIONS.SET_CURSOR,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (observer.current) {
      refFirst.current && observer.current.observe(refFirst.current);
      refLast.current && observer.current.observe(refLast.current);

      return () => {
        refFirst.current && observer.current!.unobserve(refFirst.current);
        refLast.current && observer.current!.unobserve(refLast.current);
      };
    }
  }, [observer, refFirst, refLast]);

  return new Array(25).fill(pictures[0]).map((pic, i) => ({ ...pic, id: i }));
};
