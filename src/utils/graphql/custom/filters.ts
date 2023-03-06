import { graphQLRequest } from "../request";

export interface Filters {
  camera: {
    model: string;
    make: string;
  }[];
  films: {
    brand: string;
    name: string;
    speed: number;
  }[];
  lenses: {
    model: string;
    make: string;
  }[];
}

export const FILTERS_QUERY = `
query filters {
  cameras {
      model
      make
  }
  films {
      brand
      name
      iso
  }
  lenses {
      model
      make
  }
}
`;

export const getFilters = async () => graphQLRequest<Filters>(FILTERS_QUERY);
