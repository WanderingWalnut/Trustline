import ActionTypes from '../ActionTypes';

function updateLocation(location) {
  return {
    type: ActionTypes.UPDATE,
    payload: location,
  };
}

// Creates a "middleware" that performs the actual navigation according to the `environment` being used.
// For example, when `BrowserProtocol` is used, it calls methods of the `history` object.
// A better name for this function could be something like `createProtocolMiddleware(environment)`.
// A better name for "environment" could be something like "environment".
export default function createEnvironmentMiddleware(
  environment,
  { shouldIgnoreEnvironmentLocationUpdates },
) {
  return function environmentMiddleware() {
    return (next) => {
      // Whenever browser location changes,
      // perform the same changes with the internal `location` object.
      const unsubscribe = environment.subscribe((location) => {
        if (!shouldIgnoreEnvironmentLocationUpdates()) {
          next(updateLocation(location));
        }
      });

      return (action) => {
        const { type, payload } = action;

        switch (type) {
          case ActionTypes.INIT:
            return next(updateLocation(environment.init()));

          case ActionTypes.NAVIGATE:
            // `environment.navigate()` doesn't trigger the `subscribe()` listener.
            return next(updateLocation(environment.navigate(payload)));

          case ActionTypes.SHIFT:
            // `shift()` will trigger the `subscribe()` listener,
            // which will call `updateLocation()`.
            environment.shift(payload);
            // eslint-disable-next-line consistent-return
            return;

          case ActionTypes.DISPOSE:
            unsubscribe();
            // eslint-disable-next-line consistent-return
            return;

          default:
            return next(action);
        }
      };
    };
  };
}
