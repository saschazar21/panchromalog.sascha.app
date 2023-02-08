import type { Camera } from "@utils/graphql/cameras/camera";
import { atom } from "nanostores";

export const cameras = atom<Camera[]>([]);
