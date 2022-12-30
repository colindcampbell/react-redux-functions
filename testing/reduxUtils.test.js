import * as R from "ramda";
import { calcActionTypes, calcReducers } from "../package/Provider/reduxUtils";
import { defaultActions } from "../package/Provider/defaultActions";
import { handleMergeState, handleSetValue } from "../package/Provider/defaultReducers";

describe("calcActionTypes", () => {
  test("with the default actions (object action -> reducer map)", () => {
    expect(calcActionTypes(defaultActions)).toEqual({
      mergeState: "MERGE_STATE",
      setValue: "SET_VALUE",
      setValues: "SET_VALUES",
    });
  });

  test("with function action -> reducer map", () => {
    expect(calcActionTypes({ toggleItem: () => null, addToList: () => null })).toEqual({
      toggleItem: "toggleItem",
      addToList: "addToList",
    });
  });
});

const customHandler = () => null;

describe("calcReducers", () => {
  test("with default actions - Merge State", () => {
    const reducer = calcReducers(defaultActions);
    const mergeStateReducer = R.prop(defaultActions.mergeState.type, reducer);
    expect(mergeStateReducer).toEqual(handleMergeState);
  });

  test("with default actions - Set Value", () => {
    const reducer = calcReducers(defaultActions);
    const mergeStateReducer = R.prop(defaultActions.setValue.type, reducer);
    expect(mergeStateReducer).toEqual(handleSetValue);
  });
  test("with custom action - testDispatch", () => {
    const reducer = calcReducers({ testDispatch: customHandler });
    const mergeStateReducer = R.prop("testDispatch", reducer);
    expect(mergeStateReducer).toEqual(customHandler);
  });
});
