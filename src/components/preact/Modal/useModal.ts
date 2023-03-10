import { useCallback, useEffect, useRef } from "preact/hooks";

export const useModal = (onClose: (e: Event) => void = () => undefined) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!import.meta.env.SSR) {
      document.body.style.overflow = "hidden";
      ref.current?.focus();

      return () => {
        document.body.removeAttribute("style");
      };
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.key) {
      case "Enter":
      case "Escape":
        return onClose(e);
    }
  }, []);

  return {
    handleKeyUp,
    ref,
  };
};
