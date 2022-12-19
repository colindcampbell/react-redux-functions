/* eslint-disable react/prop-types */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as R from "ramda";
import { useEffect } from "react";

import { Provider, useReduxFunctions } from "../package/index";

describe("redux provider", () => {
  test("Provider renders a default value at a path in redux", () => {
    const path = ["path", "to", "value"];
    const defaultValue = "some content";
    render(<Initializer path={path} defaultValue={defaultValue} />);
    expect(screen.getByText(defaultValue)).toBeInTheDocument();
  });
  test("Provider updates a value at a path in redux and renders that value", async () => {
    const path = ["path", "to", "new", "value"];
    const defaultValue = "some content";
    const value = "new value";
    render(<Initializer path={path} defaultValue={defaultValue} value={value} />);
    await screen.getByText(value);
    expect(screen.getByText(value)).toBeInTheDocument();
  });
});

function Initializer({ path, value, defaultValue }) {
  const config = {
    initialState: R.assocPath(path, defaultValue, {}),
  };
  return (
    <Provider config={config}>
      <Content path={path} value={value} defaultValue={defaultValue} />
    </Provider>
  );
}

function Content({ path, value, defaultValue }) {
  const { useGetValue, setValue } = useReduxFunctions();
  const content = useGetValue(path);
  useEffect(() => {
    if (value && value !== defaultValue) {
      setValue({ path, value });
    }
  }, [defaultValue, path, setValue, value]);
  return <div>{content}</div>;
}
