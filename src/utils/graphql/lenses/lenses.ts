import { graphQLRequest } from "../request";
import type { Lens } from "./lens";

export interface LensesVariables {
  mount?: string;
}

export const GET_LENSES_QUERY = `
query lenses($mount: String) {
  lenses(mount: $mount) {
      model
      make
      mount {
        name
      }
      created_at
  }
}
`;

export const getLenses = async (variables: LensesVariables) =>
  graphQLRequest<{ lenses: Lens[] }>(GET_LENSES_QUERY, variables);
