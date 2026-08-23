# redux-named-reducer

A small and lightweight TypeScript utility for Redux that lets you attach names directly to reducers and automatically combine them into a fully typed Redux reducer map.

It removes the need to manually maintain reducer keys when using `combineReducers` while preserving the actual reducer names in TypeScript.

## 🚀 Key Features

- **Named Reducers:** Attach a `sliceName` directly to any Redux reducer.
- **Type-Safe Reducer Names:** Preserves reducer names as TypeScript literal types such as `"login"` instead of widening them to `string`.
- **Automatic Reducer Mapping:** Automatically creates the reducer object required by `combineReducers`.
- **Redux Toolkit Compatible:** Works with standard Redux reducers and `createSlice`.
- **Strong Type Inference:** The resulting root reducer preserves the state type for each named reducer.
- **Simple API:** Provides a small and easy-to-use API.
- **Dynamic Reducer Support:** Easily collect and combine named reducers from different parts of your application.

---

## 📦 Installation

Install the package using npm:

```bash
npm install redux-named-reducer
```

Or using yarn:

```bash
yarn add redux-named-reducer
```

Or using pnpm:

```bash
pnpm add redux-named-reducer
```

---

## 🛠️ Step-by-Step Usage

### 1. Create a Named Reducer

Use `createReduxNamedReducer` to attach a name to any normal Redux reducer.

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

const counterReducer = (state = 0, action: { type: string }) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;

    case "DECREMENT":
      return state - 1;

    default:
      return state;
  }
};

const namedCounterReducer = createReduxNamedReducer(counterReducer, "counter");
```

The reducer now contains the `sliceName`:

```typescript
console.log(namedCounterReducer.sliceName);

// "counter"
```

The `"counter"` name is also preserved as a TypeScript literal type.

```typescript
// typeof namedCounterReducer.sliceName
// "counter"
```

---

### 2. Using With Redux Toolkit `createSlice`

You can use `createReduxNamedReducer` directly with a reducer created using Redux Toolkit's `createSlice`.

First, create your normal Redux Toolkit slice:

```typescript
import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",

  initialState: {
    pending: false,
    success: null,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(initiateLogin.pending, (state) => {
        state.pending = true;
      })

      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.pending = false;
        state.success = action.payload;
      })

      .addCase(initiateLogin.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});
```

Now pass the slice reducer and slice name to `createReduxNamedReducer`:

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

export const loginSliceReducer = createReduxNamedReducer(
  loginSlice.reducer,
  loginSlice.name,
);
```

Because `loginSlice.name` is `"login"`, the resulting reducer keeps that name:

```typescript
loginSliceReducer.sliceName;

// "login"
```

This also means TypeScript can correctly infer the reducer key when it is later passed to `combineNamedSlices`.

---

### 3. Create Multiple Named Reducers

You can name each reducer when defining your application's state modules.

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

const authReducer = createReduxNamedReducer(authReducerImplementation, "auth");

const userReducer = createReduxNamedReducer(userReducerImplementation, "user");

const settingsReducer = createReduxNamedReducer(
  settingsReducerImplementation,
  "settings",
);
```

Each reducer now knows which key it should use inside the Redux state.

```typescript
authReducer.sliceName;
// "auth"

userReducer.sliceName;
// "user"

settingsReducer.sliceName;
// "settings"
```

The names are preserved as literal TypeScript types rather than being converted to a generic `string`.

---

## 🧩 Combining Named Reducers

Use `combineNamedSlices` to combine your named reducers.

```typescript
import { combineNamedSlices } from "redux-named-reducer";

const rootReducer = combineNamedSlices(
  authReducer,
  userReducer,
  settingsReducer,
);
```

The library automatically creates a reducer map equivalent to:

```typescript
{
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
}
```

You don't need to manually specify the reducer keys.

---

## 🔷 Type-Safe Root State

One of the main benefits of `redux-named-reducer` is that reducer names are preserved by TypeScript.

For example:

```typescript
const loginReducer = createReduxNamedReducer(loginSlice.reducer, "login");

const userReducer = createReduxNamedReducer(userSlice.reducer, "user");

const rootReducer = combineNamedSlices(loginReducer, userReducer);
```

You can then create your root state type:

```typescript
export type RootState = ReturnType<typeof rootReducer>;
```

TypeScript will infer a structure similar to:

```typescript
{
  login: LoginState;
  user: UserState;
}
```

Instead of losing the reducer names and getting an index signature such as:

```typescript
{
  [key: string]: unknown;
}
```

This makes the resulting reducer useful with strongly typed Redux applications.

---

## 🏪 Using With Redux Toolkit Store

You can directly use the generated reducer with `configureStore`.

```typescript
import { configureStore } from "@reduxjs/toolkit";
import {
  combineNamedSlices,
  createReduxNamedReducer,
} from "redux-named-reducer";

const counterReducer = createReduxNamedReducer(
  counterReducerImplementation,
  "counter",
);

const userReducer = createReduxNamedReducer(userReducerImplementation, "user");

const rootReducer = combineNamedSlices(counterReducer, userReducer);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

Your Redux state will now follow the reducer names:

```typescript
{
  counter: ...,
  user: ...,
}
```

---

## 🧩 Working With Existing Reducers

You don't need to change the implementation of an existing reducer.

Simply pass it to `createReduxNamedReducer`:

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

import { existingUserReducer } from "./userReducer";

export const userReducer = createReduxNamedReducer(existingUserReducer, "user");
```

The input can be any normal Redux `Reducer`.

```typescript
Reducer<State, Action>;
```

The returned value becomes:

```typescript
Reducer<State, Action> & {
  sliceName: "user";
}
```

---

## 🔄 Dynamic Reducer Collection

Named reducers can also be collected and combined dynamically.

```typescript
const reducers = [
  authReducer,
  userReducer,
  settingsReducer,
  notificationReducer,
];

const rootReducer = combineNamedSlices(...reducers);
```

You don't have to manually create:

```typescript
combineReducers({
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
  notification: notificationReducer,
});
```

The `sliceName` from each reducer is used automatically.

---

## 🔷 TypeScript Support

The package provides the `TReduxNamedReducer` type.

The reducer name is a generic type parameter:

```typescript
import { Reducer } from "@reduxjs/toolkit";

export type TReduxNamedReducer<
  S = any,
  A extends { type: string } = { type: string },
  N extends string = string,
> = Reducer<S, A> & {
  sliceName: N;
};
```

The third generic parameter represents the reducer name.

For example:

```typescript
TReduxNamedReducer<LoginState, LoginAction, "login">;
```

represents:

```typescript
Reducer<LoginState, LoginAction> & {
  sliceName: "login";
}
```

---

### Type-Safe `createReduxNamedReducer`

The `createReduxNamedReducer` function accepts a normal Redux reducer and returns a named reducer.

```typescript
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
```

Because `N` is inferred from the provided name, the name is preserved.

```typescript
const reducer = createReduxNamedReducer(loginSlice.reducer, "login");
```

TypeScript understands the result as:

```typescript
TReduxNamedReducer<LoginState, LoginAction, "login">;
```

---

### Custom State and Action Types

You can also provide your own state and action types.

```typescript
import { TReduxNamedReducer } from "redux-named-reducer";

type CounterState = {
  value: number;
};

type CounterAction =
  | {
      type: "INCREMENT";
    }
  | {
      type: "DECREMENT";
    };

const counterReducer: TReduxNamedReducer<
  CounterState,
  CounterAction,
  "counter"
> = (state = { value: 0 }, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        value: state.value + 1,
      };

    case "DECREMENT":
      return {
        value: state.value - 1,
      };

    default:
      return state;
  }
};
```

---

## 🛠️ API

### `createReduxNamedReducer`

Creates a named Redux reducer from any normal Redux reducer.

```typescript
createReduxNamedReducer(target, sliceName);
```

#### Parameters

- `target` — The normal Redux reducer.
- `sliceName` — The name that should be used for the reducer in the Redux state.

#### Example

```typescript
const userReducer = createReduxNamedReducer(existingUserReducer, "user");
```

The returned reducer contains:

```typescript
userReducer.sliceName;

// "user"
```

---

### `combineNamedSlices`

Combines multiple named reducers into a single reducer.

```typescript
combineNamedSlices(...reducers);
```

#### Example

```typescript
const rootReducer = combineNamedSlices(
  authReducer,
  userReducer,
  settingsReducer,
);
```

This is equivalent to:

```typescript
combineReducers({
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
});
```

The difference is that the reducer keys are automatically derived from `sliceName` and preserved in TypeScript.

---

### `createReduxNamedReducerMap`

Creates a reducer map from named reducers.

```typescript
createReduxNamedReducerMap(reducers);
```

#### Example

```typescript
const reducerMap = createReduxNamedReducerMap([
  authReducer,
  userReducer,
  settingsReducer,
]);
```

Result:

```typescript
{
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
}
```

The resulting map preserves the reducer names as typed keys.

This utility is also used internally by `combineNamedSlices`.

---

## ⚠️ Important Note

`createReduxNamedReducer` uses `Object.assign` to add `sliceName` to the reducer:

```typescript
Object.assign(target, {
  sliceName,
});
```

This means the original reducer is modified and the same reducer reference is returned.

```typescript
const namedReducer = createReduxNamedReducer(reducer, "users");

console.log(namedReducer === reducer);

// true
```

No new reducer function is created.

---

## 📚 Complete Example

Here is a complete example using Redux Toolkit and `createSlice`.

### Login Slice

```typescript
import { createSlice } from "@reduxjs/toolkit";

type LoginState = {
  pending: boolean;
  success: unknown;
  error: string | null;
};

const initialState: LoginState = {
  pending: false,
  success: null,
  error: null,
};

export const loginSlice = createSlice({
  name: "login",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(initiateLogin.pending, (state) => {
        state.pending = true;
      })

      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.pending = false;
        state.success = action.payload;
      })

      .addCase(initiateLogin.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});
```

### Create the Named Reducer

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

export const loginReducer = createReduxNamedReducer(
  loginSlice.reducer,
  loginSlice.name,
);
```

### Create Another Named Reducer

```typescript
export const userReducer = createReduxNamedReducer(
  userSlice.reducer,
  userSlice.name,
);
```

### Combine Them

```typescript
import { combineNamedSlices } from "redux-named-reducer";

export const rootReducer = combineNamedSlices(loginReducer, userReducer);
```

### Create the Store

```typescript
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: rootReducer,
});
```

### Create the Root State Type

```typescript
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

The resulting state is strongly typed:

```typescript
{
  login: LoginState;
  user: UserState;
}
```

You can now safely access:

```typescript
const loginState = state.login;

const isPending = state.login.pending;

const user = state.user;
```

---

## 🎯 Why Use `redux-named-reducer`?

Without this package, you normally need to manually maintain the relationship between reducer names and reducer instances:

```typescript
combineReducers({
  login: loginSlice.reducer,
  user: userSlice.reducer,
  settings: settingsSlice.reducer,
});
```

With `redux-named-reducer`, the reducer carries its own name:

```typescript
const loginReducer = createReduxNamedReducer(
  loginSlice.reducer,
  loginSlice.name,
);

const userReducer = createReduxNamedReducer(userSlice.reducer, userSlice.name);
```

Then combining them becomes:

```typescript
const rootReducer = combineNamedSlices(loginReducer, userReducer);
```

This keeps the reducer name and reducer implementation together while preserving strong TypeScript inference.

---

## 📄 License

MIT
