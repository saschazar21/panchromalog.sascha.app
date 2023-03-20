import { decode } from "blurhash";
import type { FunctionalComponent } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { HTMLAttributes } from "preact/compat";

import styles from "./Blurhash.module.css";
import classNames from "classnames";

export interface BlurhashProps extends HTMLAttributes<HTMLCanvasElement> {
  hash: string;
  height: number;
  width: number;
}

export const Blurhash: FunctionalComponent<BlurhashProps> = ({
  hash,
  height: originalHeight,
  width: originalWidth,
  ...props
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const isPortrait = useMemo(
    () => Math.max(originalHeight, originalWidth) === originalHeight,
    [originalHeight, originalWidth]
  );

  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;
      const { clientHeight, clientWidth } = canvas;

      const [height, width] = [
        isPortrait
          ? Math.floor(originalHeight * (clientWidth / originalWidth))
          : clientHeight,
        isPortrait
          ? clientWidth
          : Math.floor(originalWidth * (clientHeight / originalHeight)),
      ];

      canvas.height = height;
      canvas.width = width;

      const pixels = decode(hash, width, height);

      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);

      ctx.putImageData(imageData, 0, 0);

      setIsLoaded(true);
    }
  }, [hash, isPortrait, originalHeight, originalWidth]);

  const className = classNames(styles.canvas, { [styles.isLoaded]: isLoaded });

  return (
    <canvas
      {...props}
      ref={ref}
      className={className}
      style={{
        "--height": isPortrait ? "auto" : "100%",
        "--width": isPortrait ? "100%" : "auto",
      }}
    />
  );
};
