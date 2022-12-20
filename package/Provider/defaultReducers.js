import * as R from "ramda";
import { isNotArray, dissocIfUndefined, isNotObject } from "../functions";

export const handleSetValue = (state, action) => {
  const path = R.path(["payload", "path"], action);
  if (isNotArray(path)) {
    throw new Error("Must provide an array path in the payload of setValue", { action });
  }
  const value = R.path(["payload", "value"], action);
  return dissocIfUndefined(path, value, state);
};

export const handleSetValues = (state, action) =>
  R.pipe(
    R.propOr([], "payload"),
    R.reduce(
      (acc, item) =>
        R.pipe(R.props(["path", "value"]), ([path = [], value]) =>
          dissocIfUndefined(path, value, acc)
        )(item),
      state
    )
  )(action);

export const handleMergeState = (state, action) => {
  const actionPayload = R.prop("payload", action);
  if (R.or(isNotObject(actionPayload), isNotObject(state))) {
    throw new Error(
      "Must provide an object in the payload for mergeState and state must be an objct",
      { action, state }
    );
  }
  return R.mergeDeepLeft(actionPayload, state);
};
