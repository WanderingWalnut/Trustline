import ActionTypes from '../ActionTypes';
import isPromise from '../isPromise';
import {
  getNavigationBlockers,
  removeAllNavigationBlockers,
  runNavigationBlockers,
} from '../navigationBlockers';
import onlyAllowedOnClientSide from '../onlyAllowedOnClientSide';

// Creates a "middleware" that applies navigation blockers.
export default function createNavigationBlockerMiddleware(
  environment,
  { ignoreEnvironmentLocationUpdates },
) {
  // A "dummy" initial value that will be ignored.
  let navigationBlockersEvaluationStatus = { cancelled: false };

  function createNavigationBlockersEvaluationStatus() {
    onlyAllowedOnClientSide();
    navigationBlockersEvaluationStatus.cancelled = true;
    navigationBlockersEvaluationStatus = { cancelled: false };
    return navigationBlockersEvaluationStatus;
  }

  return function navigationListenerMiddleware() {
    return (next) => (action) => {
      const { type, payload } = action;

      // Declaring `result` variable here fixes ESLint error:
      // "Unexpected lexical declaration in case block".
      let result;

      switch (type) {
        // Prevent or allow navigation that was initiated by the application.
        case ActionTypes.NAVIGATE:
          // `resultValue` variable name works around a stupid javascript error:
          // "Cannot redeclare block-scoped variable 'result'".
          result = runNavigationBlockers(getNavigationBlockers(), payload);
          if (isPromise(result)) {
            const status = createNavigationBlockersEvaluationStatus();
            // eslint-disable-next-line consistent-return
            result.then((resultValue) => {
              if (!status.cancelled) {
                if (!resultValue) {
                  return next(action);
                }
              }
            });
          } else if (!result) {
            return next(action);
          }
          // eslint-disable-next-line consistent-return
          return;

        // Prevent or allow navigation that was initiated by the environment itself.
        // For example, in a web browser, it could happen when the user clicks the "Back"/"Forward" buttons.
        //
        // In this scenario, the web browser is already at the new location, i.e. the navigation has already happened.
        // It could be "prevented" by rewinding back to the previous location.
        //
        case ActionTypes.UPDATE:
          // If no navigation blockers to run, don't do anything.
          if (getNavigationBlockers().length === 0) {
            return next(action);
          }

          // If it was the initial page load or a redirect,
          // it's not really a navigation that could be rolled back.
          if (payload.delta === 0) {
            return next(action);
          }

          // It's not really possible for a location to not have a `delta` property in a web browser environment.
          // So this case is not something that's supposed to happen in real life.
          // Rather, it's a guard against an unsupported or incorrectly-implemented environment or something like that.
          // If there's no `delta` property on the location, it means that the previous location can't be rewound to,
          // so it can't really "prevent" the navigation that has just happened.
          if (payload.delta === null) {
            return next(action);
          }

          result = runNavigationBlockers(getNavigationBlockers(), payload);

          if (isPromise(result)) {
            const status = createNavigationBlockersEvaluationStatus();

            // While location blockers are running, rewind to the previous location.
            ignoreEnvironmentLocationUpdates(() => {
              environment.shift(-payload.delta);
            });

            result.then((promiseResult) => {
              if (promiseResult) {
                // Navigation blocked.
                // Already rewound to a previous location.
              } else if (!status.cancelled) {
                // Navigation not blocked.
                // Rewind back to the new location.
                ignoreEnvironmentLocationUpdates(() => {
                  environment.shift(payload.delta);
                });
                // Update the location.
                next(action);
              }
            });
          } else if (result) {
            // Prevent the navigation: rewind to the previous location.
            ignoreEnvironmentLocationUpdates(() => {
              environment.shift(-payload.delta);
            });
          } else {
            // Update the location.
            return next(action);
          }
          // eslint-disable-next-line consistent-return
          return;

        // Remove any navigation blockers on `DISPOSE` event.
        case ActionTypes.DISPOSE:
          removeAllNavigationBlockers();
          return next(action);

        default:
          return next(action);
      }
    };
  };
}
