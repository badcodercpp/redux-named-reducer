import { Reducer, combineReducers } from "@reduxjs/toolkit";
import { TReduxNamedReducer, TReduxReducerMap } from "../types/namedReducer";

import { createReduxNamedReducerMap } from "../utils/namedMap";

export const combineNamedSlices = <R extends readonly TReduxNamedReducer[]>(
  ...reducers: R
) => {
  const reducerMap: TReduxReducerMap<R> = createReduxNamedReducerMap(reducers);

  return combineReducers(reducerMap);
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
