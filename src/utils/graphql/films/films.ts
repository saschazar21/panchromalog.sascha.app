import { graphQLRequest } from "../request";
import type { Film } from "./film";

export const GET_FILMS_QUERY = `
query films {
  films {
      name
      brand
      speed
      type
      created_at
  }
}
`;

export const getFilms = async () =>
  graphQLRequest<{ films: Film[] }>(GET_FILMS_QUERY);
