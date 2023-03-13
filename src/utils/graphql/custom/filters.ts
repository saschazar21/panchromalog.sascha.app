import { graphQLRequest } from "../request";

export interface Filters {
  camera: {
    model: string;
    make: string;
    mount: {
      name: string;
    } | null;
  }[];
  films: {
    brand: string;
    name: string;
    speed: number;
  }[];
  lenses: {
    model: string;
    make: string;
    mount: {
      name: string;
    };
  }[];
}

export const FILTERS_QUERY = `
query filters {
  cameras {
      model
      make
      mount {
        name
      }
  }
  films {
      brand
      name
      iso
  }
  lenses {
      model
      make
      mount {
        name
      }
  }
}
`;

export const getFilters = async () => graphQLRequest<Filters>(FILTERS_QUERY);
