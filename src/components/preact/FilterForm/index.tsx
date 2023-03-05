import type { Camera } from "@utils/graphql/cameras/camera";
import type { Film } from "@utils/graphql/films/film";
import type { Lens } from "@utils/graphql/lenses/lens";
import type { FunctionalComponent } from "preact";
import { useCallback } from "preact/hooks";

export interface FilterFormProps {
  cameras: Camera[] | null;
  films: Film[] | null;
  lenses: Lens[] | null;
}

export const FilterForm: FunctionalComponent<FilterFormProps> = () => {
  const handleSubmit = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  return (
    <form method="GET" action="/" onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
};
