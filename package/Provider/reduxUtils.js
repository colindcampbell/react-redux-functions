import { useSelector } from "react-redux";
import { createAction, createReducer } from "@reduxjs/toolkit";
import * as R from "ramda";
import { defaultActions } from "./defaultActions";

export const createReducers = config => {
  const reducer = createReducer(config?.initialState, calcReducers(defaultActions));
  return {
    reducer,
    actionTypes: calcActionTypes(defaultActions),
    initialState: reducer.getInitialState(),
  };
};

export const useBindToSelector = stateSelector => R.pipe(stateSelector, useSelector);

export const bindDispatchToAction = R.curry((reducerName, dispatch, action) => (payload, meta) => {
  return R.compose(dispatch, createAction(action, formatPayload(reducerName)))(payload, meta);
});

function calcReducers(actions) {
  return R.pipe(
    R.keys,
    R.reduce((acc, name) => {
      const config = R.propOr({}, name, actions);
      return R.assoc(config?.type, config?.reducer, acc);
    }, {})
  )(actions);
}

function calcActionTypes(actions) {
  return R.pipe(
    R.keys,
    R.reduce((acc, name) => {
      const type = R.path([name, "type"], actions);
      return R.assoc(name, type, acc);
    }, {})
  )(actions);
}

function formatPayload(reducerName) {
  return (payload = {}, meta = {}) => {
    return {
      payload,
      meta: {
        ...meta,
        reducerName,
      },
    };
  };
}
