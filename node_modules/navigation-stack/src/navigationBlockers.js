import isPromise from './isPromise';
import onlyAllowedOnClientSide from './onlyAllowedOnClientSide';

let navigationBlockersList = [];

let removeBeforeDestroyListener;

export function getNavigationBlockers() {
  return navigationBlockersList;
}

function addNavigationBlockerToTheList(blocker) {
  onlyAllowedOnClientSide();
  navigationBlockersList.push(blocker);
}

function removeNavigationBlockerFromTheList(blocker) {
  onlyAllowedOnClientSide();
  navigationBlockersList = navigationBlockersList.filter((_) => _ !== blocker);
}

export function removeAllNavigationBlockers() {
  onlyAllowedOnClientSide();
  if (getNavigationBlockers().some((blocker) => blocker.beforeDestroy)) {
    removeBeforeDestroyListener();
    removeBeforeDestroyListener = undefined;
  }
  navigationBlockersList = [];
}

// Runs the `listener` while ignoring any errors that might be thrown by it.
function runNavigationBlocker({ listener }, location) {
  let result;
  try {
    result = listener(location);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Ignoring navigation blocker \`${listener.name}\` that failed with \`${error}\`.`,
    );
    // eslint-disable-next-line no-console
    console.error(error);
  }

  // If the listener returned a `Promise`, await for that `Promise`
  // and then return the result.
  if (isPromise(result)) {
    return result.catch((error) => {
      // eslint-disable-next-line no-console
      console.warn(
        `Ignoring navigation blocker \`${listener.name}\` that failed with \`${error}\`.`,
      );
      // eslint-disable-next-line no-console
      console.error(error);
    });
  }
  // The listener didn't return a `Promise`.
  // Return the "synchronous" result.
  return result;
}

// Runs all listeners in order.
// If any listener returns a non-`null` result, it stops and returns the result.
// If there's no such listener, returns `true`.
export function runNavigationBlockers(navigationBlockers, toLocation) {
  if (navigationBlockers.length === 0) {
    return undefined;
  }

  // Call the first blocker in the list.
  const result = runNavigationBlocker(navigationBlockers[0], toLocation);

  const next = () => {
    // Proceed to the next blocker.
    return runNavigationBlockers(navigationBlockers.slice(1), toLocation);
  };

  if (isPromise(result)) {
    return result.then((resultValue) => {
      if (resultValue) {
        return resultValue;
      }
      return next();
    });
  }

  if (result) {
    return result;
  }
  return next();
}

/* istanbul ignore next: not testable with Karma */
function onBeforeDestroy() {
  const result = runNavigationBlockers(getNavigationBlockers(), null);

  // If no listener returned anything, don't prevent the "unload" event.
  if (!result) {
    return undefined;
  }

  // Web browsers don't allow displaying a custom modal in "beforeunload" phase.
  // They only allow displaying a standard one, with the default text.
  // Hence, "asynchronous" listeners should be ignored.
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  if (isPromise(result)) {
    return undefined;
  }

  // Prevent the "unload" event.
  return true;
}

export function addNavigationBlocker(environment, listener) {
  onlyAllowedOnClientSide();

  // All navigation blockers also run on `beforeDestroy` event.
  // If required, this could be a parameter of this function.
  // The rationale could be that adding `beforeunload` a listener
  // disables web page caching in some browsers like Firefox.
  const beforeDestroy = true;

  // If it's the first "beforeDestroy" listener, add the global `onBeforeDestroy` listener.
  //
  // Sidenote: Add the "beforeunload" event listener only as needed, as its presence
  // prevents the page from being added to the page navigation cache:
  //
  // "In Firefox, beforeunload is not compatible with the back/forward cache (bfcache):
  //  that is, Firefox will not place pages in the bfcache if they have beforeunload listeners,
  //  and this is bad for performance."
  //
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  if (
    beforeDestroy &&
    !getNavigationBlockers().some((blocker) => blocker.beforeDestroy)
  ) {
    removeBeforeDestroyListener =
      environment.addBeforeDestroyListener(onBeforeDestroy);
  }

  const blocker = { listener, beforeDestroy };
  addNavigationBlockerToTheList(blocker);

  return () => {
    removeNavigationBlockerFromTheList(blocker);

    // If it was the last "beforeDestroy" listener, remove the global `onBeforeDestroy` listener.
    if (
      beforeDestroy &&
      !getNavigationBlockers().some(
        (navigationBlocker) => navigationBlocker.beforeDestroy,
      )
    ) {
      removeBeforeDestroyListener();
      removeBeforeDestroyListener = undefined;
    }
  };
}
