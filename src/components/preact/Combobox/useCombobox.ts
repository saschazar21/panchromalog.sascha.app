import { useEditContext } from "@utils/context/EditBlockContext";
import { useCallback, useEffect, useReducer, useRef } from "preact/hooks";
import type { ComboboxProps } from ".";

enum COMBOBOX_ACTIONS {
  RESET,
  SET_FILTERED_OPTIONS,
  SET_FOCUS,
  SET_FOCUS_ITEM,
  SET_VALUE,
}

export type ComboboxHookParams = ComboboxProps;

export interface ComboboxAction {
  payload: Partial<ComboboxState>;
  type: COMBOBOX_ACTIONS;
}

export interface ComboboxState {
  focusedItem: number;
  filtered: string[];
  hasFocus?: boolean;
  value?: string;
}

const initialState: ComboboxState = {
  filtered: [],
  focusedItem: -1,
  hasFocus: false,
  value: "",
};

const reducer = (state: ComboboxState, action: ComboboxAction) => {
  const { payload, type } = action;

  switch (type) {
    case COMBOBOX_ACTIONS.RESET:
      return {
        ...state,
        focusedItem: -1,
        filtered: [...(payload.filtered as string[])],
      };
    case COMBOBOX_ACTIONS.SET_FILTERED_OPTIONS:
      return {
        ...state,
        filtered: [...(payload.filtered as string[])],
      };
    case COMBOBOX_ACTIONS.SET_FOCUS:
      return {
        ...state,
        hasFocus: !!payload.hasFocus,
      };
    case COMBOBOX_ACTIONS.SET_FOCUS_ITEM:
      return {
        ...state,
        focusedItem: payload.focusedItem as number,
        value: payload.value as string,
      };
    case COMBOBOX_ACTIONS.SET_VALUE:
      return {
        ...state,
        value: payload.value as string,
      };
    default:
      return state;
  }
};

const init = (customInitialState: Partial<ComboboxHookParams>): ComboboxState =>
  ({
    ...initialState,
    filtered: customInitialState.options,
    value: customInitialState.value,
  }) as ComboboxState;

export const useCombobox = (initialState: ComboboxHookParams) => {
  const {
    name: _name,
    onChange,
    placeholder: _placeholder,
    ...rest
  } = initialState;
  const ref = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, rest, init);
  const [_, setIsEditing] = useEditContext() ?? [];

  const { filtered, focusedItem } = state;

  useEffect(() => {
    dispatch({
      payload: { filtered: rest.options },
      type: COMBOBOX_ACTIONS.RESET,
    });
  }, [rest.options]);

  const handleBlur = useCallback(
    (e: Event) => {
      if (e.currentTarget) {
        const { value } = e.currentTarget as HTMLInputElement;

        (e.currentTarget as HTMLInputElement).value =
          filtered.find((available) => available === value) ?? value ?? "";

        dispatch({
          payload: { hasFocus: false },
          type: COMBOBOX_ACTIONS.SET_FOCUS,
        });
      }
    },
    [filtered]
  );

  const handleClick = useCallback(
    (e: MouseEvent, option: string) => {
      e.preventDefault();
      dispatch({
        payload: { value: option },
        type: COMBOBOX_ACTIONS.SET_VALUE,
      });
      typeof onChange === "function" && onChange(option);
      (e.currentTarget as HTMLButtonElement)?.blur();

      option.length > 0 &&
        typeof setIsEditing === "function" &&
        setIsEditing(false);
    },
    [onChange, setIsEditing]
  );

  const handleFocus = useCallback((_e: Event) => {
    dispatch({
      payload: {
        hasFocus: true,
      },
      type: COMBOBOX_ACTIONS.SET_FOCUS,
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (ref.current) {
        const elements = ref.current.childNodes;
        const next = (focusedItem + 1) % elements.length;
        const previous =
          ((focusedItem > 0 ? focusedItem : elements.length) - 1) %
          elements.length;

        switch (e.key) {
          case "Tab":
          case "Enter":
            break;
          case "Escape":
            e.preventDefault();
            (e.currentTarget as HTMLElement)?.blur();
            break;
          case "ArrowDown":
            e.preventDefault();
            dispatch({
              payload: {
                focusedItem: next,
                value: (elements.item(next) as HTMLElement).innerText,
              },
              type: COMBOBOX_ACTIONS.SET_FOCUS_ITEM,
            });
            (elements.item(next) as HTMLElement).focus();
            break;
          case "ArrowUp":
            e.preventDefault();
            dispatch({
              payload: {
                focusedItem: previous,
                value: (elements.item(previous) as HTMLElement).innerText,
              },
              type: COMBOBOX_ACTIONS.SET_FOCUS_ITEM,
            });
            (elements.item(previous) as HTMLElement).focus();
            break;
          default:
            e.preventDefault();
        }
      }
    },
    [focusedItem]
  );

  const handleInput = useCallback(
    (e: Event) => {
      e.preventDefault();
      const { value } = (e.currentTarget as HTMLInputElement) ?? {};
      !!value &&
        dispatch({ payload: { value }, type: COMBOBOX_ACTIONS.SET_VALUE });

      value &&
        dispatch({
          payload: {
            filtered: rest.options.filter((option) =>
              new RegExp(value).test(option)
            ),
          },
          type: COMBOBOX_ACTIONS.SET_FILTERED_OPTIONS,
        });
    },
    [rest.options]
  );

  return {
    ...state,
    handleBlur,
    handleClick,
    handleFocus,
    handleInput,
    handleKeyDown,
    ref,
  };
};
