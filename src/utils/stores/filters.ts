import type { Camera, WithCameras } from "@utils/db/neon/cameras";
import type { Film } from "@utils/db/neon/films";
import type { Lens, WithLenses } from "@utils/db/neon/lenses";
import type { WithMount } from "@utils/db/neon/mounts";
import type { Page } from "@utils/db/sql";
import { atom, onSet, task } from "nanostores";
import { cameras } from "./cameras";
import { lenses } from "./lenses";

export enum FILTER_ACTIONS {
  RESET,
  SET_CAMERA,
  SET_CURSOR,
  SET_FILM,
  SET_LENS,
}

export interface Filters {
  camera: WithMount<WithLenses<Camera>> | null;
  film: Film | null;
  lens: WithMount<Lens> | null;
  page: number | null;
  resetGallery: boolean;
}

export interface FilterAction {
  payload: Partial<Filters>;
  type: FILTER_ACTIONS;
}

const initialState = {
  camera: null,
  film: null,
  lens: null,
  page: null,
  resetGallery: true,
};

export const filters = atom<Filters>(initialState);

export const mutateFilters = (action: FilterAction) => {
  const state = filters.get();
  switch (action.type) {
    case FILTER_ACTIONS.RESET:
      return filters.set({
        ...initialState,
        ...action.payload,
      });
    case FILTER_ACTIONS.SET_CAMERA:
      return filters.set({
        ...state,
        camera: action.payload.camera as WithMount<WithLenses<Camera>>,
        page: null,
        resetGallery: true,
      });
    case FILTER_ACTIONS.SET_CURSOR:
      return filters.set({
        ...state,
        page: action.payload.page as number,
        resetGallery: false,
      });
    case FILTER_ACTIONS.SET_FILM:
      return filters.set({
        ...state,
        page: null,
        film: action.payload.film as Film,
        resetGallery: true,
      });
    case FILTER_ACTIONS.SET_LENS:
      return filters.set({
        ...state,
        page: null,
        lens: action.payload.lens as WithMount<Lens>,
        resetGallery: true,
      });
  }
};

const refetch = async (endpoint: string, url: URL) => {
  try {
    const res: Page<WithMount<WithLenses<Camera> | WithCameras<Lens>>> =
      await fetch(url).then((res) => res.json());

    switch (endpoint) {
      case "cameras":
        return cameras.set((res.data as WithMount<WithLenses<Camera>>[]) ?? []);
      case "lenses":
    }
    return lenses.set((res.data as WithMount<WithCameras<Lens>>[]) ?? []);
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(e);
    }
  }
};

onSet(filters, async ({ newValue: { camera: newCamera, lens: newLens } }) => {
  let endpoint: string | null = null;

  const { camera: currentCamera, lens: currentLens } = filters.get();
  const params = new URLSearchParams();

  if (
    newCamera !== currentCamera ||
    newCamera?.mount?.id !== currentCamera?.mount?.id
  ) {
    endpoint = "lenses";
    newCamera && params.set("mount", newCamera.mount?.id ?? "none");
  } else if (
    newLens !== currentLens ||
    newLens?.mount.id !== currentLens?.mount.id
  ) {
    endpoint = "cameras";
    newLens && params.set("mount", newLens.mount.id);
  }

  const url = new URL(`/api/${endpoint}`, import.meta.env.SITE);
  url.search = params.toString();

  return endpoint && task(async () => refetch(endpoint as string, url));
});
