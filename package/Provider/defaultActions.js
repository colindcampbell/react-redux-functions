import { handleSetValue, handleSetValues, handleMergeState } from "./defaultReducers";

export const defaultActions = {
  setValue: { type: "SET_VALUE", reducer: handleSetValue },
  setValues: { type: "SET_VALUES", reducer: handleSetValues },
  mergeState: { type: "MERGE_STATE", reducer: handleMergeState },
};
