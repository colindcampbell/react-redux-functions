import * as R from "ramda";
import { isNotArray, throwUnlessProd } from "../functions";

export const handleSetValue = (state, action) => {
  const path = R.path(["payload", "path"], action);
  if (isNotArray(path)) {
    throwUnlessProd(
      `Must provide an array path in the payload of setValue. Action provided: ${R.toString(
        action
      )}`,
      action
    );
  }
  const value = R.path(["payload", "value"], action);

  return R.isNil(value) ? R.dissocPath(path, state) : R.assocPath(path, value, state);
};
