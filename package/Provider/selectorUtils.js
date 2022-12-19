import * as R from "ramda";
import { isNotArray, isNotNil } from "../functions";

export const stateSelector =
  ({ name, initialState }) =>
  (path, defaultValue) => {
    if (isNotArray(path)) {
      // eslint-disable-next-line no-console
      console.warn(`useGetValue path should be an Array. Supplied path: ${path}`);
      return defaultValue;
    }
    return selectValue({ path, defaultValue, name, initialState });
  };

const selectValue = R.curry(({ path = [], defaultValue, name, initialState = {} }, state) => {
  const isPathEmpty = R.isEmpty(path);
  if (isPathEmpty) {
    return defaultValue;
  }
  const dataPath = R.when(R.always(isNotNil(name)), R.prepend(name))(path);
  const hasDefaultValue = isNotNil(defaultValue);
  const pathInitialState = isPathEmpty ? R.path(path, initialState) : initialState;
  const backupValue = isPathEmpty ? pathInitialState : undefined;
  const value = R.path(dataPath, state || {});
  if (value !== undefined) {
    return value;
  }
  return hasDefaultValue ? defaultValue : backupValue;
});
