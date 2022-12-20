# react-redux-functions

React Redux Functions is a utility package for making Redux easier to use with hooks and reduce (pun intended) the boilerplate for defining new actions and reducers.

There are some built in utility functions for common tasks such as `useGetValue` for reading values in redux and `setValue` for setting a value in redux

## Example Usage

```jsx
import { Provider, useReduxFunctions } from "@colincamp/react-redux-functions";

const initialState = {
  users: [{ name: "Colin", permission: "admin", upvotes: 0 }],
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

## TODO

- Make config dynamically generate reducers and actions
- Switch to the builder callback notation (see https://redux-toolkit.js.org/api/createReducer)
- Support action definition with object or function (use the key for the action type in this case)
- Support defining selectors and binding to useSelector
  -- Also support selector creators?
- Handle reducer slices
- Documentation
