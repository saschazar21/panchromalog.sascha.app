import { useImageLink } from "@utils/hooks/useImageLink";
import classNames from "classnames";
import type { FunctionComponent } from "preact";
import type { HTMLAttributes } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import styles from "./SuspendedImage.module.css";

export interface SuspendedImageProps extends HTMLAttributes<HTMLImageElement> {
  height: number;
  width: number;
  isSuspensionPrevented?: boolean;
}

export const SuspendedImage: FunctionComponent<SuspendedImageProps> = ({
  className: customClassName,
  height,
  isSuspensionPrevented,
  src,
  width,
  ...rest
}) => {
  const ref = useRef<HTMLImageElement>(null);

  const [isLoaded, setIsLoaded] = useState(!!isSuspensionPrevented);

  const href = useImageLink({
    h: height,
    w: width,
    href: src as string,
  });

  useEffect(() => {
    if (ref.current?.complete) {
      handleOnLoad();
    }
  }, [ref]);

  const handleOnLoad = useCallback(() => {
    setIsLoaded(true);
  }, [href]);

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
