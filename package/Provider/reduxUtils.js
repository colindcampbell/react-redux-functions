import { useSelector } from "react-redux";
import { createAction, createReducer } from "@reduxjs/toolkit";
import * as R from "ramda";
import { handleSetValue } from "./defaultReducers";

const actions = {
  setValue: { type: "SET_VALUE", reducer: handleSetValue },
};

const reducers = R.pipe(
  R.keys,
  R.reduce((acc, name) => {
    const config = R.propOr({}, name, actions);
    return R.assoc(config?.type, config?.reducer, acc);
  }, {})
)(actions);

const actionTypes = R.pipe(
  R.keys,
  R.reduce((acc, name) => {
    const type = R.path([name, "type"], actions);
    return R.assoc(name, type, acc);
  }, {})
)(actions);

export const createReducers = config => {
  const reducer = createReducer(config?.initialState, reducers);
  return {
    reducer,
    actionTypes,
    initialState: reducer.getInitialState(),
  };
};

export const bindToSelector = stateSelector => R.pipe(stateSelector, useSelector);

const formatPayload =
  reducerName =>
  (payload = {}, meta = {}) => {
    return {
      payload,
      meta: {
        ...meta,
        reducerName,
      },
    };
  };

export const bindDispatchToAction = R.curry((reducerName, dispatch, action) => (payload, meta) => {
  return R.compose(dispatch, createAction(action, formatPayload(reducerName)))(payload, meta);
});
