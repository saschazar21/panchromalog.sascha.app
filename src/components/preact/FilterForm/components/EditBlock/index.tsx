import { ReactComponent as EditIcon } from "@icons/edit-3.svg";
import { EditContext } from "@utils/context/EditBlockContext";
import classNames from "classnames";
import type { FunctionalComponent, VNode } from "preact";
import { useCallback, useState } from "preact/hooks";

import styles from "@components/preact/Combobox/Combobox.module.css";
import customStyles from "./EditBlock.module.css";

export interface EditBlockProps {
  children: VNode | VNode[];
  name: string;
  subtitle?: string;
  title?: string;
}

export const EditBlock: FunctionalComponent<EditBlockProps> = ({
  children,
  name,
  subtitle,
  title,
}) => {
  const [isEditing, setIsEditing] = useState(!title);

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  }, []);

  const className = classNames(styles.wrapper, customStyles.wrapper);
  const label = classNames(styles.label, customStyles.label);

  return (
    <EditContext.Provider value={[isEditing, setIsEditing]}>
      {!isEditing ? (
        <section className={className}>
          <div className={customStyles.content}>
            <small className={label}>{name}:</small>
            {subtitle && <small>{subtitle}</small>}
            <strong className={customStyles.title}>{title}</strong>
          </div>
          <button
            className={customStyles.button}
            type="button"
            title={`Edit ${name}`}
            onClick={handleClick}
          >
            <EditIcon role="presentation" aria-hidden />
          </button>
        </section>
      ) : (
        children
      )}
    </EditContext.Provider>
  );
};
