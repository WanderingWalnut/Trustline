import ActionTypes from '../ActionTypes';
import normalizeInputLocation from '../normalizeInputLocation';

// This "middleware" transforms input location argument into a proper `NormalizedInputLocation`.
export default function normalizeInputLocationMiddleware() {
  return (next) => (action) => {
    const { type, payload } = action;

    switch (type) {
      case ActionTypes.PUSH:
      case ActionTypes.REPLACE:
        return next({
          type,
          payload: normalizeInputLocation(payload),
        });

      default:
        return next(action);
    }
  };
}
