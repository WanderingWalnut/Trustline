import ActionTypes from '../ActionTypes';

// This "middleware" transforms a `PUSH` / `REPLACE` action into a `NAVIGATE` action.
export default function navigationActionMiddleware() {
  return (next) => (action) => {
    const { type, payload } = action;

    switch (type) {
      // Converts a `PUSH` action into a `NAVIGATE` action.
      case ActionTypes.PUSH:
        return next({
          type: ActionTypes.NAVIGATE,
          payload: { ...payload, action: 'PUSH' },
        });

      // Converts a `REPLACE` action into a `NAVIGATE` action.
      case ActionTypes.REPLACE:
        return next({
          type: ActionTypes.NAVIGATE,
          payload: { ...payload, action: 'REPLACE' },
        });

      default:
        return next(action);
    }
  };
}
