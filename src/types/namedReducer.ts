import { Reducer } from "@reduxjs/toolkit";

export type TReduxNamedReducer<
  S = any,
  A extends { type: string } = { type: string },
  N extends string = string,
> = Reducer<S, A> & {
  sliceName: N;
};

export type TReduxReducerMap<R extends readonly TReduxNamedReducer[]> = {
  [K in R[number]["sliceName"]]: Extract<R[number], { sliceName: K }>;
};
