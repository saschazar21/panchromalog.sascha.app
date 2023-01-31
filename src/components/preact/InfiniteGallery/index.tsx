import type { FunctionComponent, VNode } from "preact";
import { forwardRef, HTMLAttributes } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import styles from "./InfiniteGallery.module.css";

// https://dev.to/hey_yogini/infinite-scrolling-in-react-with-intersection-observer-22fh

const NUM_SQUARES = 3;

const Square: FunctionComponent<HTMLAttributes<HTMLDivElement>> = forwardRef(
  (props, ref) => {
    return (
      <div
        style={{ backgroundColor: "black" }}
        width="360"
        height="360"
        ref={ref}
        {...props}
      />
    );
  }
);

export const InfiniteGallery: FunctionComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [lastElement, setLastElement] = useState<any>(null);

  const getSquares = useCallback((num: number, start = 0) => {
    return new Array(num).fill(null).map((_, i) => (
      <Square
        className={styles.square}
        key={start + i}
        ref={i === NUM_SQUARES - 1 ? setLastElement : null}
      >
        {start + i}
      </Square>
    ));
  }, []);

  const [squares, setSquares] = useState(getSquares(NUM_SQUARES));

  const handleObserve = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setSquares((sq) => [...sq, ...getSquares(NUM_SQUARES, sq.length)]);
    }
  }, []);

  const observer = useRef(
    new IntersectionObserver(handleObserve, {
      root: ref.current,
      rootMargin: "0px",
      threshold: 0.9,
    })
  );

  useEffect(() => {
    lastElement && observer.current.observe(lastElement);

    return () => {
      lastElement && observer.current.unobserve(lastElement);
    };
  }, [lastElement, observer]);

  return (
    <section ref={ref} className={styles.gallery}>
      {squares}
    </section>
  );
};
