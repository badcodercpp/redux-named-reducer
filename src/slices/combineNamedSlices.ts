import { Reducer, combineReducers } from "@reduxjs/toolkit";

import { TReduxNamedReducer } from "../types/namedReducer";
import { createReduxNamedReducerMap } from "../utils/namedMap";

export const combineNamedSlices = <
  R extends readonly TReduxNamedReducer<any, any, string>[],
>(
  ...reducers: R
) => {
  return combineReducers(createReduxNamedReducerMap(reducers));
};

export const createReduxNamedReducer = <
  S,
  A extends { type: string },
  N extends string,
>(
  target: Reducer<S, A>,
  sliceName: N,
): TReduxNamedReducer<S, A, N> => {
  return Object.assign(target, {
    sliceName,
  });
};
