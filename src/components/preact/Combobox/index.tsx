import type { FunctionalComponent } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";

export interface ComboboxProps {
  name: string;
  onChange?: (value: string) => void;
  options: string[];
  value?: string;
}

export const Combobox: FunctionalComponent<ComboboxProps> = (props) => {
  const { name, onChange, options, value: externalValue } = props;
  const ref = useRef<HTMLInputElement>(null);
  const [filtered, setFiltered] = useState(options);
  const [value, setValue] = useState<string>(externalValue as string);

  const handleChange = useCallback(
    (e: Event) => {
      e.preventDefault();
      const { value } = ref.current ?? {};

      value &&
        setFiltered(() =>
          options.filter((option) => new RegExp(value).test(option))
        );
    },
    [options]
  );

  const handleClick = useCallback(
    (e: MouseEvent, option: string) => {
      e.preventDefault();
      setValue(option);
      typeof onChange === "function" && onChange(option);
    },
    [filtered]
  );

  const filteredOptions = useMemo(
    () =>
      filtered.map((option) => (
        <button
          type="button"
          onClick={(e: MouseEvent) => handleClick(e, option)}
          key={option}
        >
          {option}
        </button>
      )),
    [filtered]
  );

  return (
    <div>
      <label for={name}>{name}:</label>
      <input
        type="text"
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
      />
      {filteredOptions.length && <div>{filteredOptions}</div>}
    </div>
  );
};
