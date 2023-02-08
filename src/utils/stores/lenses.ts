import type { Lens } from "@utils/graphql/lenses/lens";
import { atom } from "nanostores";

export const lenses = atom<Lens[]>([]);
