import { TReduxNamedReducer } from "../types/namedReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { createReduxNamedReducerMap } from "../utils/namedMap";

export const combineNamedSlices = (...reducers: TReduxNamedReducer[]) => {
  return combineReducers(createReduxNamedReducerMap(reducers));
};

export const createReduxNamedReducer = (
  target: TReduxNamedReducer,
  sliceName: string,
) => {
  const reducer: TReduxNamedReducer = Object.assign(target, {
    sliceName,
  });
  return reducer;
};
