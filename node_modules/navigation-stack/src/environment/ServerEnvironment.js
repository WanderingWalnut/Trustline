import normalizeInputLocation from '../normalizeInputLocation';

function noop() {}

function serverSideNavigationNotPossible() {
  throw new Error('Server-side navigation is not possible');
}

export default class ServerEnvironment {
  constructor(initialLocation) {
    this._location = normalizeInputLocation(initialLocation);
  }

  init() {
    return {
      action: 'POP',
      ...this._location,
    };
  }

  subscribe() {
    // Server environment emits no location events.
    return noop;
  }

  // Navigation methods are not implemented, because `ServerPEnvironment` instances
  // cannot navigate.
  navigate() {
    serverSideNavigationNotPossible();
  }

  // Navigation methods are not implemented, because `ServerEnvironment` instances
  // cannot navigate.
  shift() {
    serverSideNavigationNotPossible();
  }

  // "Before destroy" listeners are currently ignored.
  // If required, one could implement a `_destroy()` method
  // and there check that the listeners actually do get called.
  addBeforeDestroyListener() {
    return () => {};
  }

  // It doesn't seem to make any sense to store anything on server side.
  // Hence, state management methods are "no op" stubs.
  getState() {
    return null;
  }

  removeState() {}

  setState() {}
}
