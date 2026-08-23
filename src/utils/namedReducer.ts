import { Reducer } from "@reduxjs/toolkit";

export type TReduxNamedReducer<
  S = any,
  A extends { type: string } = { type: string },
  N extends string = string,
> = Reducer<S, A> & {
  sliceName: N;
};
