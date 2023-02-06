import { graphQLRequest } from "../request";
import type { Camera } from "./camera";

export const GET_CAMERAS_QUERY = `
query cameras {
  cameras {
      model
      make
      created_at
  }
}
`;

export const getCameras = async () =>
  graphQLRequest<{ cameras: Camera[] }>(GET_CAMERAS_QUERY);
