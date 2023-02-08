import type { Film } from "@utils/graphql/films/film";
import { atom } from "nanostores";

export const films = atom<Film[]>([]);
