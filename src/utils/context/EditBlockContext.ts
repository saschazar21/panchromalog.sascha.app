import { createContext } from "preact";
import { StateUpdater, useContext } from "preact/hooks";

export const EditContext = createContext<
  [boolean, StateUpdater<boolean>] | null
>(null);

export const useEditContext = () => useContext(EditContext);
