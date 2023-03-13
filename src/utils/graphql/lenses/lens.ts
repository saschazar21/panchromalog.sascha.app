import { graphQLRequest } from "../request";

export interface Lens {
  model: string;
  make: string;
  mount: {
    name: string;
  };
  created_at: string;
}

export interface LensVariables {
  model: string;
}

export const GET_LENS_QUERY = `
query lens($model: String!) {
  lens(model: $model) {
      model
      make
      mount {
        name
      }
      created_at
  }
}
`;

export const getLens = async (variables: LensVariables) =>
  graphQLRequest<{ lens: Lens }>(GET_LENS_QUERY, variables);
