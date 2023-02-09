import type { Camera } from "../cameras/camera";
import type { Film } from "../films/film";
import type { Lens } from "../lenses/lens";
import { graphQLRequest } from "../request";

export interface Developer {
  name: string;
  duration: string;
}

export interface Geo {
  description?: string;
  latitude: string;
  longitude: string;
}

export interface ImageMeta {
  aperture: number;
  camera: Camera;
  date: string;
  developer?: Developer;
  film?: Film;
  focal_length: number;
  geo?: Geo;
  height: number;
  lens: Lens;
  shutter: number;
  width: number;
}

export interface Image {
  id: string;
  created_at: string;
  description?: string;
  meta: ImageMeta;
  path: string;
  title?: string;
}

export interface ImageVariables {
  id: string;
}

export const GET_IMAGE_QUERY = `
query image($id: String!) {
  image(id: $id) {
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
`;

export const getImage = async (variables: ImageVariables) =>
  graphQLRequest<{ image: Image }>(GET_IMAGE_QUERY, variables);