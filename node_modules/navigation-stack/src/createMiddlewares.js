import createBasePathMiddleware from './middleware/createBasePathMiddleware';
import createEnvironmentMiddleware from './middleware/createEnvironmentMiddleware';
import createNavigationBlockerMiddleware from './middleware/createNavigationBlockerMiddleware';
import navigationActionMiddleware from './middleware/navigationActionMiddleware';
import normalizeInputLocationMiddleware from './middleware/normalizeInputLocationMiddleware';

export default function createMiddlewares(environment, options) {
  // Allows temporarily ignoring certain environment location updates.
  let shouldIgnoreEnvironmentLocationUpdates = false;
  const ignoreEnvironmentLocationUpdates = (func) => {
    shouldIgnoreEnvironmentLocationUpdates = true;
    func();
    shouldIgnoreEnvironmentLocationUpdates = false;
  };

  return [
    // Validates that the action "payload" (input location) is a proper `NormalizedInputLocation`.
    normalizeInputLocationMiddleware,
    // Transforms a "PUSH" / "REPLACE" action into a "NAVIGATE" action.
    navigationActionMiddleware,
    // If a website is hosted under a certain path (`basePath`)
    // then this middleware will automatically strip that starting segment from the `pathname` of `location`s.
    createBasePathMiddleware(options && options.basePath),
    // Allows blocking navigation.
    // Handles `NAVIGATE` actions dispatched by the application itself.
    createNavigationBlockerMiddleware(environment, {
      ignoreEnvironmentLocationUpdates,
    }),
    // This "middleware" performs the actual navigation according to the `environment` being used.
    // For example, when `BrowserEnvironment` is used, it calls methods of the `history` object.
    createEnvironmentMiddleware(environment, {
      shouldIgnoreEnvironmentLocationUpdates: () =>
        shouldIgnoreEnvironmentLocationUpdates,
    }),
    // Allows blocking navigation.
    // Handles location `UPDATE` actions dispatched by the environment.
    createNavigationBlockerMiddleware(environment, {
      ignoreEnvironmentLocationUpdates,
    }),
  ];
}
