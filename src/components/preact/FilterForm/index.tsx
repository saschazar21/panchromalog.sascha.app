import { Combobox } from "@components/preact/Combobox";
import type { FilterInit } from "@utils/helpers";
import type { FunctionalComponent } from "preact";
import { useCallback } from "preact/hooks";
import { FILTERFORM_ACTIONS, useFilterForm } from "./useFilterForm";

import styles from "./FilterForm.module.css";

export type FilterFormProps = FilterInit;

export const FilterForm: FunctionalComponent<FilterFormProps> = (props) => {
  const { children: _, ...rest } = props;
  const { dispatch, camera, cameras, film, films, lens, lenses } =
    useFilterForm(rest);

  const handleChange = useCallback(
    (payload: string, name: string) => {
      switch (name) {
        case "camera":
          return dispatch({
            payload,
            type: FILTERFORM_ACTIONS.SET_CAMERA,
          });
        case "film":
          return dispatch({
            payload,
            type: FILTERFORM_ACTIONS.SET_FILM,
          });
        case "lens":
          return dispatch({
            payload,
            type: FILTERFORM_ACTIONS.SET_LENS,
          });
      }
    },
    [dispatch]
  );

  const handleSubmit = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  return (
    <form
      className={styles.form}
      method="GET"
      action="/"
      onSubmit={handleSubmit}
    >
      {cameras.length > 0 && (
        <Combobox
          name="camera"
          options={cameras}
          placeholder="Enter camera name"
          value={camera?.model ?? null}
          onChange={(payload) => handleChange(payload, "camera")}
        />
      )}
      {lenses.length > 0 && (
        <Combobox
          name="lens"
          options={lenses}
          placeholder="Enter lens name"
          value={lens?.model ?? null}
          onChange={(payload) => handleChange(payload, "lens")}
        />
      )}
      {films.length > 0 && (
        <Combobox
          name="film"
          options={films}
          placeholder="Enter film name"
          value={film?.name ?? null}
          onChange={(payload) => handleChange(payload, "film")}
        />
      )}
      {import.meta.env.SSR && <button type="submit">Submit</button>}
    </form>
  );
};
