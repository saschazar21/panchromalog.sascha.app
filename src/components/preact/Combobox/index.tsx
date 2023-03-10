import { ReactComponent as CloseIcon } from "@icons/x.svg";
import type { FunctionalComponent } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import styles from "./Combobox.module.css";
import { useCombobox } from "./useCombobox";

export interface ComboboxProps {
  name: string;
  onChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
  value?: string | null;
}

export const Combobox: FunctionalComponent<ComboboxProps> = (props) => {
  const { name, options, placeholder } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState(0);
  const {
    filtered,
    value,
    handleBlur,
    handleClick,
    handleFocus,
    handleInput,
    hasFocus,
  } = useCombobox(props);

  useEffect(() => {
    setClientHeight(ref.current?.clientHeight ?? 0);
  }, [filtered]);

  const filteredOptions = useMemo(
    () =>
      filtered.map((option) => (
        <button
          className={styles.option}
          type="button"
          onClick={(e: MouseEvent) => handleClick(e, option)}
          key={option}
        >
          {option}
        </button>
      )),
    [filtered]
  );

  const dataListOptions = useMemo(
    () =>
      options.map((option) => (
        <option value={option} key={"datalist-" + option} />
      )),
    [options]
  );

  return (
    <section className={styles.wrapper} data-noprint>
      <label className={styles.label} for={name}>
        {name}:
      </label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          id={name}
          list={import.meta.env.SSR ? name + "-datalist" : undefined}
          name={name}
          placeholder={placeholder}
          value={value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onInput={handleInput}
          {...(!import.meta.env.SSR
            ? {
                role: "combobox",
                "aria-controls": name + "-options",
                "aria-expanded": hasFocus,
              }
            : {})}
        />
        {import.meta.env.SSR && options.length > 0 && (
          <datalist id={name + "-datalist"}>{dataListOptions}</datalist>
        )}
        {!import.meta.env.SSR && (
          <button
            type="button"
            title="Clear input"
            disabled={!value?.length}
            onClick={(e: MouseEvent) => handleClick(e, "")}
          >
            <CloseIcon role="presentation" aria-hidden />
          </button>
        )}
      </div>
      {!import.meta.env.SSR && filteredOptions.length > 0 && (
        <div
          id={name + "-options"}
          className={styles.options}
          style={{
            "--height": clientHeight + "px",
          }}
        >
          <div ref={ref}>{filteredOptions}</div>
        </div>
      )}
    </section>
  );
};
