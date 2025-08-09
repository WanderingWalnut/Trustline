import ActionTypes from '../src/ActionTypes';

export function shouldWarn(about) {
  console.warn.expected.push(about); // eslint-disable-line no-console
}

export function invokeLocationMiddleware(middleware, action) {
  let result;

  function next(nextAction) {
    result = nextAction;
  }

  middleware()(next)(action);

  return result;
}

export function transformInputLocationUsingMiddleware(middleware, location) {
  return invokeLocationMiddleware(middleware, {
    type: ActionTypes.NAVIGATE,
    payload: location,
  }).payload;
}

export function transformEnvironmentLocationUsingMiddleware(
  middleware,
  location,
) {
  return invokeLocationMiddleware(middleware, {
    type: ActionTypes.UPDATE,
    payload: location,
  }).payload;
}
