export interface PageMeta {
  entries: number;
  page: number;
  pages: number;
}

export interface Page<T> {
  data: T[];
  meta: PageMeta;
}

export type WithPaginate<T> = T & { offset: number; size: number };

export type WithSearchResult<T> = T & { accuracy: number | null };

export type WithSearchTerm<T> = T & { searchTerm: string | null };

export const MOUNTS = "mounts";
export const LENSES = "lenses";
export const IMAGES = "images";
export const IMAGES_META = "images_meta";
export const FILMS = "films";
export const DEVELOPERS = "developers";
export const DEVELOPERS_IMAGES_META = "developers_images_meta";
export const CAMERAS = "cameras";
