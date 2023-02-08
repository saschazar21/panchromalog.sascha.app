import { useStore } from "@nanostores/preact";
import { Filters, filters as filterStore } from "@utils/stores/filters";
import { gallery as galleryStore } from "@utils/stores/gallery";
import { useEffect } from "preact/hooks";

export const useGallery = (initialFilters: Partial<Filters> = {}) => {
  const filters = useStore(filterStore);
  const gallery = useStore(galleryStore);

  useEffect(() => {
    filterStore.set({ ...filterStore.get(), ...initialFilters });
  }, []);

  return {
    ...filters,
    ...gallery,
  };
};
