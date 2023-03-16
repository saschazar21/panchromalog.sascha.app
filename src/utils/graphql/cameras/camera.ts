import { graphQLRequest } from "../request";

export interface Camera {
  model: string;
  make: string;
  mount: {
    name: string;
  } | null;
  created_at: string;
}

export interface CameraVariables {
  model: string;
}

export const GET_CAMERA_QUERY = `
query camera($model: String!) {
  camera(model: $model) {
      model
      make
      mount {
        name
      }
      created_at
  }
}
`;

export const getCamera = async (variables: CameraVariables) =>
  graphQLRequest<{ camera: Camera }>(GET_CAMERA_QUERY, variables);
