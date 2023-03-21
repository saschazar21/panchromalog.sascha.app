import { useImageLink } from "@utils/hooks/useImageLink";
import classNames from "classnames";
import type { FunctionalComponent } from "preact";
import type { HTMLAttributes } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import styles from "./SuspendedImage.module.css";

export interface SuspendedImageProps extends HTMLAttributes<HTMLImageElement> {
  onLoaded?: (isLoaded: boolean) => void;
  height: number;
  width: number;
}

export const SuspendedImage: FunctionalComponent<SuspendedImageProps> = ({
  className: customClassName,
  height,
  src,
  width,
  onLoaded,
  ...rest
}) => {
  const ref = useRef<HTMLImageElement>(null);

  const [isLoaded, setIsLoaded] = useState(true);

  const href = useImageLink({
    h: height,
    w: width,
    href: src as string,
  });

  useEffect(() => {
    ref.current &&
      !ref.current?.complete &&
      setIsLoaded(() => {
        typeof onLoaded === "function" && onLoaded(false);
        return false;
      });
    if (ref.current?.complete) {
      setIsLoaded(() => {
        typeof onLoaded === "function" && onLoaded(true);
        return true;
      });
    }
  }, [onLoaded, ref]);

  const handleOnLoad = useCallback(() => {
    setIsLoaded(() => {
      typeof onLoaded === "function" && onLoaded(true);
      return true;
    });
  }, [onLoaded]);

  const className = classNames(styles.img, customClassName as string);

  return (
    <img
      onLoad={handleOnLoad}
      ref={ref}
      className={className}
      src={href}
      height={height}
      width={width}
      data-loading={!isLoaded || null}
      {...rest}
    />
  );
};
