import { TReduxNamedReducer } from "../types/namedReducer";

export type TReduxNamedReducerMap<
  R extends readonly TReduxNamedReducer<any, any, string>[],
> = {
  [K in R[number]["sliceName"]]: Extract<R[number], { sliceName: K }>;
};

export const createReduxNamedReducerMap = <
  R extends readonly TReduxNamedReducer<any, any, string>[],
>(
  reducers: R,
): TReduxNamedReducerMap<R> => {
  const result = {} as TReduxNamedReducerMap<R>;

  reducers.forEach((reducer) => {
    const key = reducer.sliceName as R[number]["sliceName"];

    (result as Record<R[number]["sliceName"], TReduxNamedReducer>)[key] =
      reducer;
  });

  return result;
};
