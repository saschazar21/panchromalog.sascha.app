import { graphQLRequest } from "../request";

export enum FilmType {
  bw = "bw",
  color = "color",
}

export interface Film {
  name: string;
  brand: string;
  speed: number;
  type: FilmType;
  created_at: string;
}

export interface FilmVariables {
  name: string;
}

export const GET_FILM_QUERY = `
query film($name: String!) {
  film(name: $name) {
      name
      brand
      speed
      type
      created_at
  }
}
`;

export const getFilm = async (variables: FilmVariables) =>
  graphQLRequest<{ film: Film }>(GET_FILM_QUERY, variables);
