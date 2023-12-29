import {
  CREATE_CAMERA,
  DELETE_CAMERA,
  SELECT_CAMERAS,
  SELECT_CAMERA_BY_ID,
} from "@utils/db/sql/cameras/queries";
import type { Lens } from "../lenses";
import type { Mount } from "../mounts";
import type { QueryTuple } from "..";
import type { WithPaginate, WithSearchTerm } from "@utils/db/sql";

export interface Camera {
  id: string;
  model: string;
  make: string | null;
  mount: string;
  created_at: string;
}

export interface GetCamerasParams {
  mount: string | null;
}

export type WithCameras<
  T extends Omit<Lens, "cameras"> | Omit<Mount, "cameras">,
> = T & {
  cameras: Camera[];
};

export const createCameraQuery = (
  data: Omit<Camera, "created_at">
): QueryTuple => {
  const params = [data.id, data.model, data.make, data.mount];
  return [CREATE_CAMERA, params];
};

export const getCameraByIdQuery = (id: string): QueryTuple => [
  SELECT_CAMERA_BY_ID,
  [id],
];

export const getCamerasQuery = (
  data: WithPaginate<WithSearchTerm<GetCamerasParams>>
): QueryTuple => {
  const params = [data.size, data.offset, data.searchTerm, data.mount];
  return [SELECT_CAMERAS, params];
};

export const deleteCameraByIdQuery = (id: string): QueryTuple => [
  DELETE_CAMERA,
  [id],
];
