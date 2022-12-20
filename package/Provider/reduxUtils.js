import { createAction, createReducer } from "@reduxjs/toolkit";
import * as R from "ramda";
import { defaultActions } from "./defaultActions";

const calcReducerWithActions = actionReducer => actions =>
  R.pipe(R.keys, R.reduce(actionReducer(actions), {}))(actions);

const reducersReducer = actions => (acc, name) => {
  const config = R.propOr({}, name, actions);
  return R.assoc(config?.type, config?.reducer, acc);
};

const actionTypesReducer = actions => (acc, name) => {
  const type = R.path([name, "type"], actions);
  return R.assoc(name, type, acc);
};

const calcReducers = calcReducerWithActions(reducersReducer);
const calcActionTypes = calcReducerWithActions(actionTypesReducer);

export const createReducers = config => {
  const reducer = createReducer(config?.initialState, calcReducers(defaultActions));
  return {
    reducer,
    actionTypes: calcActionTypes(defaultActions),
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
