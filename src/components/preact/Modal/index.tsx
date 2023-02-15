import classNames from "classnames";
import type { FunctionComponent, VNode } from "preact";
import { createPortal, HTMLAttributes } from "preact/compat";
import styles from "./Modal.module.css";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: (e: Event) => void;
}

const ModalBody: FunctionComponent<ModalProps> = ({
  children,
  className: customClassName,
  ...props
}) => {
  const className = classNames(
    styles.modal,
    customClassName as string | undefined
  );

  return (
    <div className={styles.backdrop} role="presentation">
      <div {...props} className={className}>
        {children}
      </div>
    </div>
  );
};

export const Modal: (props: ModalProps) => VNode<ModalProps> | null = (
  props
) => {
  return import.meta.env.SSR
    ? null
    : createPortal(
        <ModalBody {...props} />,
        document?.querySelector("#modal") as HTMLDivElement
      );
};
