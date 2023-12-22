import {
  CREATE_LENS,
  DELETE_LENS,
  SELECT_LENSES,
  SELECT_LENS_BY_ID,
} from "@utils/db/sql/lenses/queries";
import type { Camera } from "../cameras";
import type { Mount } from "../mounts";
import type { WithPaginate, WithSearchTerm } from "@utils/db/sql";
import type { QueryTuple } from "..";

export interface Lens {
  id: string;
  model: string;
  make: string;
  mount: string;
  max_aperture: number;
  min_focal_length: number;
  max_focal_length: number;
  created_at: string;
}

export interface GetLensesParams {
  mount: string | null;
}

export type WithLenses<
  T extends Omit<Camera, "lenses"> | Omit<Mount, "lenses">
> = T & {
  lenses: Lens[] | null;
};

export const createLensQuery = (data: Omit<Lens, "created_at">): QueryTuple => {
  const params = [
    data.id,
    data.model,
    data.make,
    data.mount,
    data.max_aperture,
    data.min_focal_length,
    data.max_focal_length,
  ];
  return [CREATE_LENS, params];
};

export const getLensByIdQuery = (id: string): QueryTuple => [
  SELECT_LENS_BY_ID,
  [id],
];

export const getLensesQuery = (
  data: WithPaginate<WithSearchTerm<GetLensesParams>>
): QueryTuple => {
  const params = [data.size, data.offset, data.searchTerm, data.mount];
  return [SELECT_LENSES, params];
};

export const deleteLensByIdQuery = (id: string): QueryTuple => [
  DELETE_LENS,
  [id],
];
