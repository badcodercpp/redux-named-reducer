# redux-named-reducer

A small and lightweight TypeScript utility for Redux that lets you attach names directly to reducers and automatically combine them into a fully typed Redux reducer map.

It removes the need to manually maintain reducer keys when using `combineReducers` while preserving reducer names and state types in TypeScript.

## 🚀 Key Features

- **Named Reducers:** Attach a `sliceName` directly to any Redux reducer.
- **Type-Safe Reducer Names:** Reducer names such as `"login"` and `"user"` are preserved as TypeScript literal types.
- **Automatic Reducer Mapping:** Automatically creates the reducer object required by `combineReducers`.
- **Strong Type Inference:** The resulting root reducer preserves the state type of each named reducer.
- **Redux Toolkit Compatible:** Works with standard Redux reducers and Redux Toolkit `createSlice`.
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

Use `createReduxNamedReducer` to give any Redux reducer a name.

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

The name is also preserved as a TypeScript literal type:

```typescript
// typeof namedCounterReducer.sliceName
// "counter"
```

---

## 2. Using With Redux Toolkit `createSlice`

`createReduxNamedReducer` works directly with reducers created using Redux Toolkit's `createSlice`.

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

Create the named reducer:

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

export const loginReducer = createReduxNamedReducer(
  loginSlice.reducer,
  "login",
);
```

You can then access the name:

```typescript
loginReducer.sliceName;

// "login"
```

For the strongest type inference, use a literal name:

```typescript
createReduxNamedReducer(loginSlice.reducer, "login");
```

---

## 3. Create Multiple Named Reducers

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

---

## 4. Combine Named Reducers

Use `combineNamedSlices` to combine all your named reducers.

```typescript
import { combineNamedSlices } from "redux-named-reducer";

const rootReducer = combineNamedSlices(
  authReducer,
  userReducer,
  settingsReducer,
);
```

Internally, this creates the equivalent reducer map:

```typescript
{
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
}
```

You don't need to manually maintain the reducer keys.

---

## 🔷 Type-Safe Root State

One of the main benefits of `redux-named-reducer` is that reducer names are preserved by TypeScript.

For example:

```typescript
const loginReducer = createReduxNamedReducer(loginSlice.reducer, "login");

const userReducer = createReduxNamedReducer(userSlice.reducer, "user");

const rootReducer = combineNamedSlices(loginReducer, userReducer);
```

Create your store:

```typescript
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: rootReducer,
});
```

Then infer your `RootState`:

```typescript
export type RootState = ReturnType<typeof store.getState>;
```

TypeScript will infer:

```typescript
type RootState = {
  login: LoginState;
  user: UserState;
};
```

Instead of losing the reducer names and getting a generic index signature such as:

```typescript
type RootState = {
  [x: string]: any;
};
```

This allows you to safely access your state:

```typescript
const loginState = state.login;

const isPending = state.login.pending;

const userState = state.user;
```

---

## 🏪 Using With Redux Toolkit Store

A complete store setup can look like this:

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

The resulting Redux state is strongly typed:

```typescript
{
  counter: CounterState;
  user: UserState;
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

The original reducer remains a normal Redux reducer.

`createReduxNamedReducer` simply attaches the `sliceName` property to it.

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

```typescript
import { Reducer } from "@reduxjs/toolkit";

export type TReduxNamedReducer<
  S = any,
  A extends { type: string } = {
    type: string;
  },
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

### `TReduxReducerMap`

The package also provides `TReduxReducerMap`, which maps each reducer's `sliceName` to its reducer.

```typescript
export type TReduxReducerMap<R extends readonly TReduxNamedReducer[]> = {
  [K in R[number]["sliceName"]]: Extract<R[number], { sliceName: K }>;
};
```

For example, given:

```typescript
const loginReducer = createReduxNamedReducer(loginSlice.reducer, "login");

const userReducer = createReduxNamedReducer(userSlice.reducer, "user");
```

The resulting reducer map is inferred as:

```typescript
{
  login: typeof loginReducer;
  user: typeof userReducer;
}
```

This type is used internally by `combineNamedSlices` to preserve reducer names and state types.

---

### Custom State and Action Types

You can provide your own state and action types:

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

Then you can combine it with other named reducers:

```typescript
const rootReducer = combineNamedSlices(counterReducer, userReducer);
```

---

## 🛠️ API

### `createReduxNamedReducer`

Creates a named Redux reducer.

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

Combines multiple named reducers into a single Redux reducer.

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

The difference is that the reducer keys are automatically derived from `sliceName`.

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

The reducer keys are inferred from the `sliceName` values.

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

Here is a complete example using Redux Toolkit.

### Create Slices

```typescript
import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",

  initialState: {
    pending: false,
    user: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

const userSlice = createSlice({
  name: "user",

  initialState: {
    id: null,
    name: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
  },
});
```

### Create Named Reducers

```typescript
import { createReduxNamedReducer } from "redux-named-reducer";

const loginReducer = createReduxNamedReducer(loginSlice.reducer, "login");

const userReducer = createReduxNamedReducer(userSlice.reducer, "user");
```

### Combine Reducers

```typescript
import { combineNamedSlices } from "redux-named-reducer";

const rootReducer = combineNamedSlices(loginReducer, userReducer);
```

### Create the Store

```typescript
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: rootReducer,
});
```

### Create Typed Redux Types

```typescript
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

The resulting `RootState` is inferred as:

```typescript
type RootState = {
  login: {
    pending: boolean;
    user: unknown;
  };

  user: {
    id: unknown;
    name: unknown;
  };
};
```

You can now safely access:

```typescript
const login = state.login;

const user = state.user;

const pending = state.login.pending;
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
const loginReducer = createReduxNamedReducer(loginSlice.reducer, "login");

const userReducer = createReduxNamedReducer(userSlice.reducer, "user");
```

Then combining them becomes:

```typescript
const rootReducer = combineNamedSlices(loginReducer, userReducer);
```

The reducer name and reducer implementation stay together while TypeScript preserves the correct reducer keys and state types.

---

## 📄 License

MIT
