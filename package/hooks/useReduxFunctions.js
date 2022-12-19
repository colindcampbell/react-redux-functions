import { useContext } from "react";
import { ReduxFunctionsContext } from "../Provider";

export const useReduxFunctions = () => {
  return useContext(ReduxFunctionsContext);
};
