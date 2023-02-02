import { graphQLRequest } from "../request";
import type { Image } from "./image";

export interface PaginatedImages {
  after: string | null;
  before: string | null;
  data: Image[];
}

export interface ImagesVariables {
  _cursor?: string;
  _size?: number;
  camera?: string;
  film?: string;
  lens?: string;
}

export const GET_IMAGES_QUERY = `
query images($camera: String, $film: String, $lens: String, $_size: Int, $_cursor: String) {
  images(camera: $camera, film: $film, lens: $lens, _size: $_size, _cursor: $_cursor) {
      after
      before
      data {
        id
        created_at
        description
        meta {
            aperture
            camera {
                model
                make
                created_at
            }
            date
            developer {
                name
                duration
            }
            film {
                name
                brand
                speed
                type
                created_at
            }
            focal_length
            geo {
                description
                latitude
                longitude
            }
            height
            lens {
                model
                make
                created_at
            }
            shutter
            width
        }
        path
        title
      }
  }
}
`;

export const getImages = async (variables: ImagesVariables) =>
  graphQLRequest<PaginatedImages>(GET_IMAGES_QUERY, variables);
