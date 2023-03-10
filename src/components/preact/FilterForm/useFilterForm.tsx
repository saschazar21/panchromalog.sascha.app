import { useStore } from "@nanostores/preact";
import type { FilterInit } from "@utils/helpers";
import { useFilters } from "@utils/hooks/useFilters";
import { cameras as camerasStore } from "@utils/stores/cameras";
import { films as filmsStore } from "@utils/stores/films";
import { FILTER_ACTIONS } from "@utils/stores/filters";
import { lenses as lensesStore } from "@utils/stores/lenses";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

export enum FILTERFORM_ACTIONS {
  SET_CAMERA,
  SET_FILM,
  SET_LENS,
  TOGGLE_MODAL,
}

export interface FilterFormAction {
  payload: string | null;
  type: FILTERFORM_ACTIONS;
}

export const useFilterForm = (filterInit: FilterInit) => {
  const {
    cameras: camerasInit,
    films: filmsInit,
    lenses: lensesInit,
    ...filters
  } = filterInit;
  const cameras = useStore(camerasStore);
  const films = useStore(filmsStore);
  const lenses = useStore(lensesStore);
  const { dispatch: filterDispatch, state } = useFilters(filters);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    camerasStore.set(camerasInit ?? []);
  }, [camerasInit]);

  useEffect(() => {
    filmsStore.set(filmsInit ?? []);
  }, [filmsInit]);

  useEffect(() => {
    lensesStore.set(lensesInit ?? []);
  }, [lensesInit]);

  const dispatch = useCallback(
    (action: FilterFormAction) => {
      const { payload, type } = action;

      switch (type) {
        case FILTERFORM_ACTIONS.SET_CAMERA:
          return filterDispatch({
            payload: {
              camera: cameras.find(({ model }) => model === payload) ?? null,
            },
            type: FILTER_ACTIONS.SET_CAMERA,
          });
        case FILTERFORM_ACTIONS.SET_FILM:
          return filterDispatch({
            payload: {
              film: films.find(({ name }) => name === payload) ?? null,
            },
            type: FILTER_ACTIONS.SET_FILM,
          });
        case FILTERFORM_ACTIONS.SET_LENS:
          return filterDispatch({
            payload: {
              lens: lenses.find(({ model }) => model === payload) ?? null,
            },
            type: FILTER_ACTIONS.SET_LENS,
          });
        case FILTERFORM_ACTIONS.TOGGLE_MODAL:
          return setIsModalOpen((value) => !value);
      }
    },
    [cameras, films, lenses]
  );

  const mappedCameras = useMemo(
    () => cameras.map(({ model }) => model),
    [cameras]
  );
  const mappedFilms = useMemo(() => films.map(({ name }) => name), [films]);
  const mappedLenses = useMemo(
    () => lenses.map(({ model }) => model),
    [lenses]
  );

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

  const handleModalToggle = useCallback((e: MouseEvent) => {
    e.defaultPrevented ?? e.preventDefault();

    dispatch({ payload: "", type: FILTERFORM_ACTIONS.TOGGLE_MODAL });
  }, []);

  return {
    handleChange,
    handleModalToggle,
    isModalOpen,
    cameras: mappedCameras,
    films: mappedFilms,
    lenses: mappedLenses,
    ...state,
  };
};
