import getLocationUrl from '../getLocationUrl';
import parseQueryFromSearch from '../parseQueryFromSearch';

export default class BrowserEnvironment {
  constructor() {
    this._keyPrefix = Math.random().toString(36).slice(2, 8);
    this._keyIndex = 0;

    this._index = null;
  }

  init() {
    const { pathname, search, hash } = window.location;

    const { key, index = 0, state } = window.history.state || {};
    const delta = this._index != null ? index - this._index : 0;
    this._index = index;

    return {
      action: 'POP',
      pathname,
      search,
      query: search && parseQueryFromSearch(search),
      hash,
      key,
      index,
      delta,
      state,
    };
  }

  // Subscribes to changes in location,
  // excluding ones that happened as a result of calling `.navigate()`.
  subscribe(listener) {
    const onPopState = () => {
      listener(this.init());
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }

  navigate(location) {
    const { action, state } = location;

    const push = action === 'PUSH';

    if (!push && action !== 'REPLACE') {
      throw Error(`Unrecognized browser environment action: ${action}`);
    }

    const delta = push ? 1 : 0;
    const extraState = this._createExtraState(delta);

    const browserState = { state, ...extraState };
    const url = getLocationUrl(location);

    if (push) {
      window.history.pushState(browserState, null, url);
    } else {
      window.history.replaceState(browserState, null, url);
    }

    return { ...location, ...extraState, delta };
  }

  shift(delta) {
    window.history.go(delta);
  }

  addBeforeDestroyListener(onBeforeDestroy) {
    const onBeforeUnload = (event) => {
      if (onBeforeDestroy()) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }

  _createExtraState(delta) {
    const keyIndex = this._keyIndex++;
    this._index += delta;

    return {
      key: `${this._keyPrefix}:${keyIndex.toString(36)}`,
      index: this._index,
    };
  }

  // Returns either a `string` value or `null` if the key doesn't exist.
  getState(key) {
    // FYI: `sessionStorage` persists across page reloads.
    return window.sessionStorage.getItem(key);
  }

  removeState(key) {
    window.sessionStorage.removeItem(key);
  }

  setState(key, value) {
    window.sessionStorage.setItem(key, value);
  }
}
