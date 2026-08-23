# redux-named-reducer

A small and lightweight TypeScript utility for Redux that lets you attach names directly to reducers and automatically combine them into a Redux reducer map.

It removes the need to manually maintain reducer keys when using `combineReducers`.

## 🚀 Key Features

- **Named Reducers:** Attach a `sliceName` directly to any Redux reducer.
- **Automatic Reducer Mapping:** Automatically creates the reducer object required by `combineReducers`.
- **Simple API:** Provides a small and easy-to-use API.
- **TypeScript Support:** Includes a reusable `TReduxNamedReducer` type.
- **Redux Toolkit Compatible:** Works with `@reduxjs/toolkit` and `combineReducers`.
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

Use `createReduxNamedReducer` to give your reducer a name.

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

// counter
```

---

### 2. Create Multiple Named Reducers

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

### 3. Combine Named Reducers

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

And passes it to Redux Toolkit's `combineReducers`.

---

### 4. Use With Redux Toolkit

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

This makes it useful when you already have reducers defined in separate modules.

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

The package provides the `TReduxNamedReducer` type:

```typescript
import { Reducer } from "@reduxjs/toolkit";

export type TReduxNamedReducer<
  S = any,
  A extends { type: string } = { type: string },
> = Reducer<S, A> & {
  sliceName: string;
};
```

This means your reducer is a normal Redux reducer with an additional `sliceName` property.

You can also provide your own state and action types:

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

const counterReducer: TReduxNamedReducer<CounterState, CounterAction> = (
  state = { value: 0 },
  action,
) => {
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

Then give it a name:

```typescript
const namedCounterReducer = createReduxNamedReducer(counterReducer, "counter");
```

usage with createSlice

```
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // start loading
    builder

      // start
      .addCase(initiateLogin.pending, state => {
        state.pending = true;
      })
      // success
      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.pending = false;
        // Add Claims to the state array
        state.success = action.payload;
      })
      // rejected
      .addCase(initiateLogin.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message ?? 'Unknown Error';
      });
  },
});
```

now you can use `createReduxNamedReducer` to create named reducer as following

```
export const loginSliceReducer = createReduxNamedReducer(
  loginSlice.reducer,
  loginSlice.name,
);
```

---

## 🛠️ API

### `createReduxNamedReducer`

Creates a named Redux reducer.

```typescript
createReduxNamedReducer(target, sliceName);
```

#### Parameters

- `target` — The Redux reducer.
- `sliceName` — The name that should be used for the reducer in the Redux state.

#### Example

```typescript
const userReducer = createReduxNamedReducer(existingUserReducer, "user");
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

---

## 📚 Complete Example

Here is a complete example using Redux Toolkit:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import {
  combineNamedSlices,
  createReduxNamedReducer,
} from "redux-named-reducer";

const counterReducer = createReduxNamedReducer(
  (state = 0, action: { type: string }) => {
    switch (action.type) {
      case "INCREMENT":
        return state + 1;

      case "DECREMENT":
        return state - 1;

      default:
        return state;
    }
  },
  "counter",
);

const userReducer = createReduxNamedReducer(
  (state = null, action: { type: string }) => {
    switch (action.type) {
      case "SET_USER":
        return action.user;

      default:
        return state;
    }
  },
  "user",
);

const rootReducer = combineNamedSlices(counterReducer, userReducer);

export const store = configureStore({
  reducer: rootReducer,
});
```

The resulting Redux state:

```typescript
{
  counter: 0,
  user: null,
}
```

---

## 📄 License

MIT
