import { useEditContext } from "@utils/context/EditBlockContext";
import { useCallback, useReducer } from "preact/hooks";
import type { ComboboxProps } from ".";

enum COMBOBOX_ACTIONS {
  SET_FILTERED_OPTIONS,
  SET_FOCUS,
  SET_VALUE,
}

export type ComboboxHookParams = ComboboxProps;

export interface ComboboxAction {
  payload: Partial<ComboboxState>;
  type: COMBOBOX_ACTIONS;
}

export interface ComboboxState {
  filtered: string[];
  hasFocus?: boolean;
  value?: string;
}

const reducer = (state: ComboboxState, action: ComboboxAction) => {
  const { payload, type } = action;

  switch (type) {
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
    filtered: customInitialState.options,
    hasFocus: false,
    value: customInitialState.value,
  } as ComboboxState);

export const useCombobox = (initialState: ComboboxHookParams) => {
  const {
    name: _name,
    onChange,
    placeholder: _placeholder,
    ...rest
  } = initialState;
  const [state, dispatch] = useReducer(reducer, rest, init);
  const [_, setIsEditing] = useEditContext() ?? [];

  const { filtered, value } = state;

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
    [value]
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
    [filtered]
  );

  const handleFocus = useCallback((_e: Event) => {
    dispatch({
      payload: {
        hasFocus: true,
      },
      type: COMBOBOX_ACTIONS.SET_FOCUS,
    });
  }, []);

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
  };
};
