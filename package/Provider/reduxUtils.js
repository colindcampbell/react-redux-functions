import { createAction, createReducer } from "@reduxjs/toolkit";
import * as R from "ramda";
import { defaultActions } from "./defaultActions";

const calcReducerWithActions = actionReducer => actions =>
  R.pipe(R.keys, R.reduce(actionReducer(actions), {}))(actions);

const reducersReducer = actions => (acc, name) => {
  const reducer = R.pathOr(R.prop(name, actions), [name, "reducer"], actions);
  const type = R.pathOr(name, [name, "type"], actions);
  return R.assoc(type, reducer, acc);
};

export const actionTypesReducer = actions => (acc, name) => {
  const type = R.pathOr(name, [name, "type"], actions);
  return R.assoc(name, type, acc);
};

export const calcReducers = calcReducerWithActions(reducersReducer);
export const calcActionTypes = calcReducerWithActions(actionTypesReducer);

export const createReducers = (config = { initialState: {}, actions: {} }) => {
  const actions = R.mergeDeepRight(config?.actions, defaultActions);
  const reducer = createReducer(config?.initialState, calcReducers(actions));
  return {
    reducer,
    actionTypes: calcActionTypes(actions),
    initialState: reducer.getInitialState(),
  };
};

export const bindDispatchToAction = R.curry((reducerName, dispatch, action) => (payload, meta) => {
  return R.compose(dispatch, createAction(action, formatPayload(reducerName)))(payload, meta);
});

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
