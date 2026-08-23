import { TReduxNamedReducer, TReduxReducerMap } from "../types/namedReducer";

export const createReduxNamedReducerMap = <
  R extends readonly TReduxNamedReducer[],
>(
  reducers: R,
): TReduxReducerMap<R> => {
  const result = {} as TReduxReducerMap<R>;

  for (const reducer of reducers) {
    (result as Record<string, TReduxNamedReducer>)[reducer.sliceName] = reducer;
  }

  return result;
};
