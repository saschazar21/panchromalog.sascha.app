import type { ImageOptions } from "@utils/hooks/useImageLink";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export const ImageContext = createContext<ImageOptions | null>(null);

export const useImageContext = () => useContext(ImageContext);
