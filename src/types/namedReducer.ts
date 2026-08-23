import { Reducer } from "@reduxjs/toolkit";

export type TReduxNamedReducer<
  S = any,
  A extends { type: string } = { type: string },
> = Reducer<S, A> & {
  sliceName: string;
};
