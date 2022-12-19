import { createContext, useMemo } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReducers, bindDispatchToAction, useBindToSelector } from "./reduxUtils";
import { valueTransformer } from "../functions";
import { stateSelector } from "./selectorUtils";

export const ReduxFunctionsContext = createContext();

// eslint-disable-next-line react/prop-types
export function Provider({ children, config = {} }) {
  const { reducer, actionTypes, initialState } = useMemo(() => createReducers(config), [config]);
  const store = useMemo(
    () =>
      configureStore({
        reducer,
      }),
    [reducer]
  );
  return (
    <ReduxProvider store={store}>
      <ReduxFunctionProvider actionTypes={actionTypes} initialState={initialState}>
        {children}
      </ReduxFunctionProvider>
    </ReduxProvider>
  );
}

// eslint-disable-next-line react/prop-types
function ReduxFunctionProvider({ children, actionTypes, initialState = {} }) {
  const dispatch = useDispatch();
  // This transform function will bind dispatch and create action to the values in the genericActions object
  const actionBinder = useMemo(() => bindDispatchToAction("default", dispatch), [dispatch]);
  // Create actions and bind dispatch to them. Each action is ready to be called with a payload
  const actions = useMemo(
    () => valueTransformer(actionBinder, actionTypes),
    [actionBinder, actionTypes]
  );

  const useGetValue = useBindToSelector(stateSelector({ initialState }));

  const context = useMemo(() => ({ ...actions, useGetValue }), [actions, useGetValue]);

  return (
    <ReduxFunctionsContext.Provider value={context}>{children}</ReduxFunctionsContext.Provider>
  );
}
