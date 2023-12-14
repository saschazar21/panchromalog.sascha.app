import {
  SELECT_IMAGES,
  SELECT_IMAGE_BY_ID,
} from "@utils/db/sql/images/queries";
import type { QueryTuple } from "..";
import type { WithPaginate } from "@utils/db/sql";

export interface ImageMeta {
  id: string;
  alt: string;
  aperture: number | null;
  camera: string;
  color: string | null;
  date: string | null;
  film: string;
  focal_length: number;
  hash: string | null;
  height: number;
  iso: number;
  lens: string | null;
  shutter: number;
  width: number;
}

export interface Image {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

export interface GetImagesParams {
  camera: string | null;
  lens: string | null;
  film: string | null;
}

export type WithImageMeta<T extends Image> = T & {
  meta: ImageMeta;
};

export const getImageByIdQuery = (id: string): QueryTuple => [
  SELECT_IMAGE_BY_ID,
  [id],
];

export const getImagesQuery = (
  data: WithPaginate<GetImagesParams>
): QueryTuple => {
  const params = [data.size, data.offset, data.camera, data.lens, data.film];
  return [SELECT_IMAGES, params];
};
