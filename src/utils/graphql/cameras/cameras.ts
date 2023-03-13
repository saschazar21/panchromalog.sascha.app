import { graphQLRequest } from "../request";
import type { Camera } from "./camera";

export interface CamerasVariables {
  mount?: string;
}

export const GET_CAMERAS_QUERY = `
query cameras($mount: String) {
  cameras(mount: $mount) {
      model
      make
      mount {
        name
      }
      created_at
  }
}
`;

export const getCameras = async (variables: CamerasVariables) =>
  graphQLRequest<{ cameras: Camera[] }>(GET_CAMERAS_QUERY, variables);
