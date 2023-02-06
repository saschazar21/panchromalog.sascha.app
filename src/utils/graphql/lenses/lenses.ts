import { graphQLRequest } from "../request";
import type { Lens } from "./lens";

export const GET_LENSES_QUERY = `
query lenses {
  lenses {
      model
      make
      created_at
  }
}
`;

export const getLenses = async () =>
  graphQLRequest<{ lenses: Lens[] }>(GET_LENSES_QUERY);
