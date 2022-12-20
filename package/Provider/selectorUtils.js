import * as R from "ramda";
import { isNotArray, isNotNil } from "../functions";

export const stateSelector =
  ({ sliceName, initialState }) =>
  (path, defaultValue) => {
    if (isNotArray(path)) {
      // eslint-disable-next-line no-console
      console.warn(`useGetValue path should be an Array. Supplied path: ${path}`);
      return defaultValue;
    }
    return selectValue({ path, defaultValue, sliceName, initialState });
  };

const selectValue = R.curry(({ path = [], defaultValue, sliceName, initialState = {} }, state) => {
  const isPathEmpty = R.isEmpty(path);
  if (isPathEmpty) {
    return defaultValue;
  }
  const dataPath = R.when(R.always(isNotNil(sliceName)), R.prepend(sliceName))(path);
  const hasDefaultValue = isNotNil(defaultValue);
  const pathInitialState = isPathEmpty ? R.path(path, initialState) : initialState;
  const backupValue = isPathEmpty ? pathInitialState : undefined;
  const value = R.path(dataPath, state || {});
  if (value !== undefined) {
    return value;
  }
  return hasDefaultValue ? defaultValue : backupValue;
});
