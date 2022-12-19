import * as React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";

import { Provider } from "../package/Provider";

test("Provider renders children", () => {
  const children = "Some text";
  render(<Provider>{children}</Provider>);
  expect(screen.getByText(children)).toBeInTheDocument();
});
