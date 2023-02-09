import { useStore } from "@nanostores/preact";
import { filters as filterStore, Filters } from "@utils/stores/filters";
import { useEffect } from "preact/hooks";

export const useFilters = (filterInit: Partial<Filters> = {}) => {
  const filters = useStore(filterStore);

  useEffect(() => {
    filterStore.set({ ...filterStore.get(), ...filterInit });
  }, []);

  return filters;
};
