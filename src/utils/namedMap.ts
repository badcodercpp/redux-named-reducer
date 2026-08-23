import { Reducer } from "@reduxjs/toolkit";
import { TReduxNamedReducer } from "../types/namedReducer";

export const createReduxNamedReducerMap = (reducers: TReduxNamedReducer[]) => {
  return reducers.reduce(
    (acc, reducer) => {
      acc[reducer.sliceName] = reducer;
      return acc;
    },
    {} as Record<string, Reducer>,
  );
};
