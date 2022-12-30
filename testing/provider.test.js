/* eslint-disable react/prop-types */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as R from "ramda";
import { useEffect } from "react";

import { Provider, useReduxFunctions } from "../package/index";

describe.skip("redux provider - default actions", () => {
  test("Provider renders a default value at a path in redux in the DOM", () => {
    const path = ["path", "to", "value"];
    const defaultValue = "some content";
    const initialState = {
      path: {
        to: {
          value: defaultValue,
        },
      },
    };
    render(
      <Initializer
        path={path}
        defaultValue={defaultValue}
        initialState={initialState}
        Renderer={Content}
      />
    );
    expect(screen.getByText(defaultValue)).toBeInTheDocument();
  });
  test("Provider updates a value at a path in redux and renders that value in the DOM", () => {
    const path = ["path", "to", "new", "value"];
    const defaultValue = "some content";
    const initialState = {
      path: {
        to: {
          new: {
            value: defaultValue,
          },
        },
      },
    };
    const value = "new value";
    render(
      <Initializer
        initialState={initialState}
        path={path}
        defaultValue={defaultValue}
        value={value}
        Renderer={Content}
      />
    );
    expect(screen.getByText(value)).toBeInTheDocument();
  });
});

describe("redux provider - custom actions simple", () => {
  const addToValueReducer = (state, action) => {
    const payloadPath = R.path(["payload", "path"], action);
    const payloadValue = R.pathOr(1, ["payload", "value"], action);
    return R.pipe(
      R.pathOr(0, payloadPath),
      R.add(payloadValue),
      R.assocPath(payloadPath, R.__, state)
    )(state);
  };
  const path = ["path", "to", "new", "value"];
  const defaultValue = 0;
  const initialState = {
    path: {
      to: {
        new: {
          value: defaultValue,
        },
      },
    },
  };
  const value = 1;
  test("Should call the user provided reducer when the action is dispatched - function map", () => {
    render(
      <Initializer
        initialState={initialState}
        path={path}
        defaultValue={defaultValue}
        value={value}
        Renderer={ContentWithCustomReducer}
        actions={{
          addToValue: addToValueReducer,
        }}
      />
    );
    expect(screen.getByText(`total: ${value}`)).toBeInTheDocument();
  });
  test("Should call the user provided reducer when the action is dispatched - object map", () => {
    render(
      <Initializer
        initialState={initialState}
        path={path}
        defaultValue={defaultValue}
        value={value}
        Renderer={ContentWithCustomReducer}
        actions={{
          addToValue: {
            reducer: addToValueReducer,
            type: "ADD_TO_VALUE",
          },
        }}
      />
    );
    expect(screen.getByText(`total: ${value}`)).toBeInTheDocument();
  });
});

function Initializer({ initialState, path, value, defaultValue, actions, Renderer }) {
  const config = {
    initialState,
    actions,
  };
  return (
    <Provider config={config}>
      <Renderer path={path} value={value} defaultValue={defaultValue} />
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

function ContentWithCustomReducer({ path, value, defaultValue }) {
  const { useGetValue, addToValue } = useReduxFunctions();
  const content = useGetValue(path);
  useEffect(() => {
    if (value && value !== defaultValue) {
      addToValue({ path });
    }
  }, [addToValue, defaultValue, path, value]);
  return <div>{`total: ${content}`}</div>;
}
