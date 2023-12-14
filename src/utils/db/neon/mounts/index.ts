import {
  CREATE_MOUNT,
  SELECT_MOUNTS,
  SELECT_MOUNT_BY_ID,
} from "@utils/db/sql/mounts/queries";
import type { QueryTuple } from "..";
import type { Camera } from "../cameras";
import type { Lens } from "../lenses";
import type { WithPaginate, WithSearchTerm } from "@utils/db/sql";

export interface Mount {
  id: string;
  make: string | null;
  mount: string;
}

export type WithMount<T extends Camera & Lens> = T & {
  mount: Mount | null;
};

export const createMountQuery = (data: Mount): QueryTuple => {
  const params = [data.id, data.make, data.mount];
  return [CREATE_MOUNT, params];
};

export const getMountByIdQuery = (id: string): QueryTuple => [
  SELECT_MOUNT_BY_ID,
  [id],
];

export const getMountsQuery = (
  data: WithPaginate<WithSearchTerm<Record<string, never>>>
): QueryTuple => {
  const params = [data.size, data.offset, data.searchTerm];
  return [SELECT_MOUNTS, params];
};
