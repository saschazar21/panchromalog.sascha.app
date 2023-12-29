import type { WithCameras } from "@utils/db/neon/cameras";
import type { Lens } from "@utils/db/neon/lenses";
import type { WithMount } from "@utils/db/neon/mounts";
import { atom } from "nanostores";

export const lenses = atom<WithMount<WithCameras<Lens>>[]>([]);
