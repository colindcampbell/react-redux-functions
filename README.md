# react-redux-functions

React Redux Functions is a utility package for making Redux easier to use with hooks and reduce (pun intended) the boilerplate for defining new actions and reducers.

There are some built in utility functions for common tasks such as `useGetValue` for reading values in redux and `setValue` for setting a value in redux

## Example Usage

```jsx
import { Provider, useReduxFunctions } from "@colincamp/react-redux-functions";

const initialState = {
  users: [{ id: 1, model: "users", name: "Colin", permission: "admin", upvotes: 0 }],
};

function Root() {
  return (
    <Provider config={{ initialState }}>
      <FirstUser path={["users", 0]} />
      <UpvoteFirstUser path={["users", 0]} />
    </Provider>
  );
}

function FirstUser({ path }) {
  const { useGetValue } = useReduxFunctions();
  const { name, permission, upvotes } = useGetValue(path, {});
  return (
    <p>{`the first user ${name} with permission ${permission} has been upvoted ${upvotes} times`}</p>
  );
}

function UpvoteFirstUser({ path }) {
  const { useGetValue, setValue } = useReduxFunctions();
  const { name, upvotes } = useGetValue(path, {});
  const handleUpvote = () => {
    setValue({
      path: [...path, "upvotes"],
      value: upvotes + 1,
    });
  };
  return <button onClick={handleUpvote}>{`Click to upvote ${name}`}</button>;
}

const root = createRoot(document.getElementById("container"));
root.render(<Root />);
```

## Extending with Custom Actions and Reducers

When calling the `Provider` component you can provide an `actions` object in the `config` prop. This object is a mapping between and action name and a reducer function in the simple case

```js
const actions = {
  [actionName]: reducerFn,
};
```

In this case the action name is also the `type` in the payload once the action is dispatched.

You can also use the object definition if you would like to provide a custom `type` for the action.

```js
const actions = {
  [actionName]: {
    reducer: reducerFn,
    type: "CUSTOM_ACTION_TYPE",
  },
};
```

The actions defined will then be available to pull out of the `useReduxFunctions` hook, and when called will dispatch that action with the payload provided as first argument in the function call. The optional second argument will be the meta in the action object.

```js
// Inside some component:
const { actionName } = useReduxFunctions();
const payload = { some: { payload: [] } };
const meta = { component: "SomeSneakyComponent" };
actionName(payload, meta);
/*
  action:
  {
    type: actionName || "CUSTOM_ACTION_TYPE",
    payload: { some: { payload: [] } },
    meta: { component: "SomeSneakyComponent" },
  }
*/
```

### Custom Action Example

```jsx
import { Provider, useReduxFunctions } from "@colincamp/react-redux-functions";
import * as R from "ramda";

const initialState = {
  users: [{ id: 1, model: "users", name: "Colin", permission: "admin", upvotes: 0 }],
};

const addToValueReducer = (state, action) => {
  const payloadPath = R.path(["payload", "path"], action);
  const payloadValue = R.pathOr(1, ["payload", "value"], action);
  return R.pipe(
    R.pathOr(0, payloadPath),
    R.add(payloadValue),
    R.assocPath(payloadPath, R.__, state)
  )(state);
};

const actions = {
  addToValue: {
    reducer: addToValueReducer,
    type: "ADD_TO_VALUE",
  },
};

function Root() {
  return (
    <Provider config={{ initialState, actions }}>
      <FirstUser path={["users", 0]} />
      <UpvoteFirstUser path={["users", 0]} />
    </Provider>
  );
}

function FirstUser({ path }) {
  const { useGetValue } = useReduxFunctions();
  const { name, permission, upvotes } = useGetValue(path, {});
  return (
    <p>{`the first user ${name} with permission ${permission} has been upvoted ${upvotes} times`}</p>
  );
}

function UpvoteFirstUser({ path }) {
  const { useGetValue, addToValue } = useReduxFunctions();
  const { name, upvotes } = useGetValue(path, {});
  const handleUpvote = value => () => {
    /*
    action dispatched:
    {
      type: "ADD_TO_VALUE",
      path: ["users", 0, "upvotes],
      value: value (undefined or 5)
    }
    */
    addToValue({
      path: [...path, "upvotes"],
      value,
    });
  };
  return (
    <>
      <button onClick={handleUpvote()}>{`Click to upvote ${name} one time`}</button>
      <button onClick={handleUpvote(5)}>{`Click to upvote ${name} five times`}</button>
    </>
  );
}

const root = createRoot(document.getElementById("container"));
root.render(<Root />);
```

## TODO

- ~Make config dynamically generate reducers and actions~
- Switch to the builder callback notation (see https://redux-toolkit.js.org/api/createReducer)
- ~Support action definition with object or function (use the key for the action type in this case)~
- Support defining selectors and binding to useSelector
  -- Also support selector creators?
- Handle reducer slices
- Documentation
