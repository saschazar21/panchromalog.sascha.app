import { ReactComponent as CloseIcon } from "@icons/x.svg";
import classNames from "classnames";
import type { FunctionComponent, VNode } from "preact";
import { createPortal, HTMLAttributes, useEffect } from "preact/compat";
import styles from "./Modal.module.css";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  modalControls?: VNode | VNode[];
  onClose?: (e: MouseEvent) => void;
}

const ModalBody: FunctionComponent<ModalProps> = ({
  children,
  className: customClassName,
  modalControls,
  onClose,
  ...props
}) => {
  useEffect(() => {
    if (!import.meta.env.SSR) {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.removeAttribute("style");
      };
    }
  }, []);

  const className = classNames(
    styles.modal,
    customClassName as string | undefined
  );

  return (
    <div className={styles.container} role="presentation">
      <div className={styles.backdrop} onClick={onClose} />
      <div {...props} className={className}>
        <div className={styles.controls}>
          {modalControls}
          <button
            type="button"
            title="Close modal"
            onClick={onClose}
            className={styles.button}
          >
            <CloseIcon role="presentation" aria-hidden />
          </button>
        </div>
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
