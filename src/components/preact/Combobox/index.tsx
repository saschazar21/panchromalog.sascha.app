import { ReactComponent as CloseIcon } from "@icons/x.svg";
import { useEditContext } from "@utils/context/EditBlockContext";
import type { FunctionalComponent } from "preact";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";

import styles from "./Combobox.module.css";

export interface ComboboxProps {
  name: string;
  onChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
  value?: string | null;
}

export const Combobox: FunctionalComponent<ComboboxProps> = (props) => {
  const { name, onChange, options, placeholder, value: externalValue } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [_, setIsEditing] = useEditContext() ?? [];
  const [clientHeight, setClientHeight] = useState(0);
  const [filtered, setFiltered] = useState(options);
  const [value, setValue] = useState<string>(externalValue as string);

  useEffect(() => {
    setClientHeight(ref.current?.clientHeight ?? 0);
  }, [filtered]);

  const handleBlur = useCallback(
    (e: Event) => {
      if (e.currentTarget) {
        const { value } = e.currentTarget as HTMLInputElement;

        (e.currentTarget as HTMLInputElement).value =
          filtered.find((available) => available === value) ??
          externalValue ??
          "";
      }
    },
    [externalValue]
  );

  const handleClick = useCallback(
    (e: MouseEvent, option: string) => {
      e.preventDefault();
      setValue(option);
      typeof onChange === "function" && onChange(option);
      (e.currentTarget as HTMLButtonElement)?.blur();

      option.length > 0 &&
        typeof setIsEditing === "function" &&
        setIsEditing(false);
    },
    [filtered]
  );

  const handleInput = useCallback(
    (e: Event) => {
      e.preventDefault();
      const { value } = (e.currentTarget as HTMLInputElement) ?? {};
      !!value && setValue(value);

      value &&
        setFiltered(() =>
          options.filter((option) => new RegExp(value).test(option))
        );
    },
    [options]
  );

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
          onInput={handleInput}
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
