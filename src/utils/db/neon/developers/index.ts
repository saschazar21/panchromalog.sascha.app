import type { ImageMeta } from "../images";

export interface Developer {
  name: string;
}

export interface DeveloperImageMeta {
  developer: string;
  duration: number;
  image: string;
}

export type WithDeveloper<T extends ImageMeta> = T & {
  developer: DeveloperImageMeta;
};
