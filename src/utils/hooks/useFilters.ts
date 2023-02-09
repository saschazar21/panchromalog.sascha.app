import { useStore } from "@nanostores/preact";
import {
  filters,
  Filters,
  mutateFilters,
  FILTER_ACTIONS,
} from "@utils/stores/filters";
import { useEffect } from "preact/hooks";

export const useFilters = (filterInit?: Partial<Filters>) => {
  const state = useStore(filters);
  const dispatch = mutateFilters;

  useEffect(() => {
    filterInit &&
      dispatch({
        payload: filterInit,
        type: FILTER_ACTIONS.RESET,
      });
  }, []);

  return {
    state,
    dispatch,
  };
};
