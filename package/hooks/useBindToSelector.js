import { useSelector } from "react-redux";
import * as R from "ramda";

export const useBindToSelector = stateSelector => R.pipe(stateSelector, useSelector);
