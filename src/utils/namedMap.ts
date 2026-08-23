import { TReduxNamedReducer } from "../types/namedReducer";

export type TReduxNamedReducerMap<R extends readonly TReduxNamedReducer[]> = {
  [K in R[number]["sliceName"]]: Extract<R[number], { sliceName: K }>;
};

export const createReduxNamedReducerMap = <
  R extends readonly TReduxNamedReducer[],
>(
  reducers: R,
): TReduxNamedReducerMap<R> => {
  const result = {} as TReduxNamedReducerMap<R>;

  reducers.forEach((reducer) => {
    const key = reducer.sliceName as R[number]["sliceName"];

    result[key] = reducer as TReduxNamedReducerMap<R>[typeof key];
  });

  return result;
};
