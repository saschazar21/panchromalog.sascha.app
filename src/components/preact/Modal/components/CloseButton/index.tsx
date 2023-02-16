import type { FunctionComponent } from "preact";
import type { HTMLAttributes } from "preact/compat";

import styles from "./CloseButton.module.css";

export interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const CloseButton: FunctionComponent<CloseButtonProps> = (props) => {
  return (
    <button type="button" title="Close Modal" {...props}>
      <svg
        viewBox="0 0 6 6"
        className={styles.icon}
        aria-hidden
        role="presentation"
      >
        <title>Close</title>
        <path d="M3,0 v6 M0,3 h6" />
      </svg>
    </button>
  );
};
