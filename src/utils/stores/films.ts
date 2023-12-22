import type { Film } from "@utils/db/neon/films";
import { atom } from "nanostores";

export const films = atom<Film[]>([]);
