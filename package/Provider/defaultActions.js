import { handleSetValue } from "./defaultReducers";

export const defaultActions = {
  setValue: { type: "SET_VALUE", reducer: handleSetValue },
};
