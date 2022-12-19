import * as R from "ramda";

export const isNotNil = R.pipe(R.isNil, R.not);
export const isArray = R.is(Array);
export const isNotArray = R.complement(isArray);
export const notEquals = R.complement(R.equals);

// The value transformer takes an object and a transform function and returns a new object with the values transformed by the transform function
export const valueTransformer = R.curry((transformFn, original) => {
  const transformReducer = (acc, key) => R.assoc(key, transformFn(original[key]), acc);
  return R.compose(R.reduce(transformReducer, {}), R.keys)(original);
});

export const throwUnlessProd = (...props) => {
  if (notEquals("production", process.env.NODE_ENV)) {
    throw new Error(...props);
  }
};
