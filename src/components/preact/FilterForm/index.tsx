import { Combobox } from "@components/preact/Combobox";
import type { FilterInit } from "@utils/helpers";
import type { FunctionalComponent } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { FILTERFORM_ACTIONS, useFilterForm } from "./useFilterForm";

import styles from "./FilterForm.module.css";
import { EditBlock } from "./components/EditBlock";

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

  const noscript = useMemo(
    () =>
      import.meta.env.SSR ? (
        <noscript className={styles.form}>
          {Array.isArray(rest.cameras) && (
            <Combobox
              name="camera"
              options={rest.cameras.map(({ model }) => model)}
              placeholder="Enter camera model"
              value={rest.camera?.model}
            />
          )}
          {Array.isArray(rest.lenses) && (
            <Combobox
              name="lens"
              options={rest.lenses.map(({ model }) => model)}
              placeholder="Enter lens model"
              value={rest.lens?.model}
            />
          )}
          {Array.isArray(rest.films) && (
            <Combobox
              name="film"
              options={rest.films.map(({ name }) => name)}
              placeholder="Enter film name"
              value={rest.film?.name}
            />
          )}
          <button type="submit" data-noprint>
            Submit
          </button>
        </noscript>
      ) : null,
    []
  );

  return (
    <form
      className={styles.form}
      method="GET"
      action="/"
      onSubmit={handleSubmit}
    >
      {noscript}
      {cameras.length > 0 && (
        <EditBlock name="camera" subtitle={camera?.make} title={camera?.model}>
          <Combobox
            name="camera"
            options={cameras}
            placeholder="Enter camera model"
            value={camera?.model ?? null}
            onChange={(payload) => handleChange(payload, "camera")}
          />
        </EditBlock>
      )}
      {lenses.length > 0 && (
        <EditBlock name="lens" subtitle={lens?.make} title={lens?.model}>
          <Combobox
            name="lens"
            options={lenses}
            placeholder="Enter lens model"
            value={lens?.model ?? null}
            onChange={(payload) => handleChange(payload, "lens")}
          />
        </EditBlock>
      )}
      {films.length > 0 && (
        <EditBlock name="film" subtitle={film?.brand} title={film?.name}>
          <Combobox
            name="film"
            options={films}
            placeholder="Enter film name"
            value={film?.name ?? null}
            onChange={(payload) => handleChange(payload, "film")}
          />
        </EditBlock>
      )}
    </form>
  );
};
