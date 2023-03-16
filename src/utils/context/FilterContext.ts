import type { Filters } from "@utils/stores/filters";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export const FilterContext = createContext<Filters | null>(null);

export const useFilterContext = () => useContext(FilterContext);
