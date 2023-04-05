import classNames from "classnames";
import type { FunctionalComponent } from "preact";
import type { HTMLAttributes } from "preact/compat";

import styles from "./Placeholder.module.css";

export type PlaceholderProps = HTMLAttributes<HTMLDivElement>;

export const Placeholder: FunctionalComponent<PlaceholderProps> = ({
  className: customClassName,
  ...props
}) => {
  const className = classNames(styles.placeholder, customClassName as string);

  return (
    <div
      role="presentation"
      aria-hidden={true}
      className={className}
      {...props}
    />
  );
};
