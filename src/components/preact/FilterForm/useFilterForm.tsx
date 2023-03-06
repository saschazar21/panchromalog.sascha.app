import { useStore } from "@nanostores/preact";
import type { FilterInit } from "@utils/helpers";
import { useFilters } from "@utils/hooks/useFilters";
import { cameras as camerasStore } from "@utils/stores/cameras";
import { films as filmsStore } from "@utils/stores/films";
import { FILTER_ACTIONS } from "@utils/stores/filters";
import { lenses as lensesStore } from "@utils/stores/lenses";
import { useCallback, useEffect, useMemo } from "preact/hooks";

export enum FILTERFORM_ACTIONS {
  SET_CAMERA,
  SET_FILM,
  SET_LENS,
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
              camera: cameras.find(({ model }) => model === payload),
            },
            type: FILTER_ACTIONS.SET_CAMERA,
          });
        case FILTERFORM_ACTIONS.SET_FILM:
          return filterDispatch({
            payload: {
              film: films.find(({ name }) => name === payload),
            },
            type: FILTER_ACTIONS.SET_FILM,
          });
        case FILTERFORM_ACTIONS.SET_LENS:
          return filterDispatch({
            payload: {
              lens: lenses.find(({ model }) => model === payload),
            },
            type: FILTER_ACTIONS.SET_LENS,
          });
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

  return {
    dispatch,
    cameras: mappedCameras,
    films: mappedFilms,
    lenses: mappedLenses,
    ...state,
  };
};
