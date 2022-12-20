import { dissocIfUndefined } from "../package/functions";

describe("dissocIfUndefined", () => {
  const path = ["path", "to", "value"];
  const state = { path: { to: { value: "test value", second: "another value" } } };
  test("should dissoc a value in an object if the value is undefined at the path", () => {
    const newValue = undefined;
    expect(dissocIfUndefined(path, newValue, state)).toEqual({
      path: { to: { second: "another value" } },
    });
  });
  test("should assoc a value if the new value is not undefined", () => {
    const newValue = "new value";
    expect(dissocIfUndefined(path, newValue, state)).toEqual({
      path: { to: { value: "new value", second: "another value" } },
    });
  });
});
