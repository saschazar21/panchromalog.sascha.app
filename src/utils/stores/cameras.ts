import type { Camera } from "@utils/db/neon/cameras";
import type { WithLenses } from "@utils/db/neon/lenses";
import type { WithMount } from "@utils/db/neon/mounts";
import { atom } from "nanostores";

export const cameras = atom<WithMount<WithLenses<Camera>>[]>([]);
