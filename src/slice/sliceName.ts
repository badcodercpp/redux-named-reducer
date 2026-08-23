import { Reducer, combineReducers } from "@reduxjs/toolkit";

import { TReduxNamedReducer } from "../types/namedReducer";
import { createReduxNamedReducerMap } from "../utils/namedMap";

export const combineNamedSlices = (...reducers: TReduxNamedReducer[]) => {
  return combineReducers(createReduxNamedReducerMap(reducers));
};

export const createReduxNamedReducer = <
  S = any,
  A extends { type: string } = { type: string },
>(
  target: Reducer<S, A>,
  sliceName: string,
): TReduxNamedReducer<S, A> => {
  return Object.assign(target, {
    sliceName,
  });
};
