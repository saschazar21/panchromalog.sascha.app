import {
  CREATE_FILM,
  DELETE_FILM,
  SELECT_FILMS,
  SELECT_FILM_BY_ID,
} from "@utils/db/sql/films/queries";
import type { QueryTuple } from "..";
import type { WithPaginate, WithSearchTerm } from "@utils/db/sql";

export type FilmType = "bw" | "color";

export interface Film {
  id: string;
  name: string;
  brand: string;
  iso: number;
  type: FilmType;
  created_at: string;
}

export interface GetFilmsParams {
  type: FilmType | null;
}

export const createFilmQuery = (data: Omit<Film, "created_at">): QueryTuple => {
  const params = [data.id, data.name, data.brand, data.iso, data.type];
  return [CREATE_FILM, params];
};

export const getFilmByIdQuery = (id: string): QueryTuple => [
  SELECT_FILM_BY_ID,
  [id],
];

export const getFilmsQuery = (
  data: WithPaginate<WithSearchTerm<GetFilmsParams>>
): QueryTuple => [
  SELECT_FILMS,
  [data.size, data.offset, data.searchTerm, data.type],
];

export const deleteFilmByIdQuery = (id: string): QueryTuple => [
  DELETE_FILM,
  [id],
];
