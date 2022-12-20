import { createContext, useMemo } from "react";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createReducers, bindDispatchToAction } from "./reduxUtils";
import { valueTransformer } from "../functions";
import { stateSelector } from "./selectorUtils";
import { useBindToSelector } from "../hooks";

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
  // Create actions and bind dispatch to them. Each action is ready to be called with a payload
  const actions = useMemo(
    () => valueTransformer(bindDispatchToAction("default", dispatch), actionTypes),
    [actionTypes, dispatch]
  );

  const useGetValue = useBindToSelector(stateSelector({ initialState }));

  const context = useMemo(
    () => ({ ...actions, useGetValue, useSelector, dispatch }),
    [actions, dispatch, useGetValue]
  );

  return (
    <ReduxFunctionsContext.Provider value={context}>{children}</ReduxFunctionsContext.Provider>
  );
}
