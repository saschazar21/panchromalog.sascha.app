import { buildParams } from "@utils/helpers";
import { useFilters } from "@utils/hooks/useFilters";
import { useEffect } from "preact/hooks";

export const useFilterHistory = () => {
  const { state } = useFilters();

  useEffect(() => {
    if (!import.meta.env.SSR) {
      const url = new URL(window.location.href);
      const params = buildParams(state);
      url.search = params.toString();

      window.history.pushState(Object.fromEntries(params), "", url.toString());
    }
  }, [state]);
};
