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
