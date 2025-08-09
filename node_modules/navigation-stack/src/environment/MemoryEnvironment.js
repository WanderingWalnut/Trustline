import normalizeInputLocation from '../normalizeInputLocation';

export default class MemoryEnvironment {
  constructor(initialLocation, { save, load } = {}) {
    this._save = save;
    this._load = load;

    const initialState = load ? this._loadState() : null;
    if (initialState) {
      this._stack = initialState.stack;
      this._index = initialState.index;
      this._state = initialState.state;
    } else {
      this._stack = [normalizeInputLocation(initialLocation)];
      this._index = 0;
      this._state = {};
    }

    this._keyPrefix = Math.random().toString(36).slice(2, 8);
    this._keyIndex = 0;

    this._listener = null;
  }

  _loadState() {
    try {
      const { stack, index, state } = JSON.parse(this._load());

      // Check that the stack and index at least seem reasonable before using
      // them as state. This isn't foolproof, but it might prevent mistakes.
      // Also perform a basic validation of `state`.
      if (
        Array.isArray(stack) &&
        typeof index === 'number' &&
        stack[index] &&
        typeof state === 'object' &&
        state !== null
      ) {
        return { stack, index, state };
      }
    } catch (error) {} // eslint-disable-line no-empty

    return null;
  }

  init(delta = 0) {
    return {
      ...this._stack[this._index],
      action: 'POP',
      index: this._index,
      delta,
    };
  }

  subscribe(listener) {
    this._listener = listener;

    return () => {
      this._listener = null;
    };
  }

  navigate(location) {
    const { action, pathname, search, query, hash, state } = location;

    const push = action === 'PUSH';

    if (!push && action !== 'REPLACE')
      throw Error(`Unrecognized browser environment action: ${action}`);

    const delta = push ? 1 : 0;
    this._index += delta;

    const keyIndex = this._keyIndex++;
    const key = `${this._keyPrefix}:${keyIndex.toString(36)}`;

    this._stack[this._index] = { pathname, search, query, hash, state, key };
    if (push) {
      this._stack.length = this._index + 1;
    }

    if (this._save) {
      this._saveState();
    }

    return { ...location, key, index: this._index, delta };
  }

  shift(delta) {
    const prevIndex = this._index;

    this._index = Math.min(
      Math.max(this._index + delta, 0),
      this._stack.length - 1,
    );

    if (this._index === prevIndex) {
      return;
    }

    if (this._save) {
      this._saveState();
    }

    if (this._listener) {
      this._listener(this.init(this._index - prevIndex));
    }
  }

  // "Before destroy" listeners are currently ignored.
  // If required, one could implement a `_destroy()` method
  // and there check that the listeners actually do get called.
  addBeforeDestroyListener(listener) {
    return () => {
      this._removeBeforeDestroyListener(listener);
    };
  }

  // This method is used in tests.
  _removeBeforeDestroyListener() {}

  _saveState() {
    try {
      this._save(
        JSON.stringify({
          stack: this._stack,
          index: this._index,
          state: this._state,
        }),
      );
    } catch (error) {} // eslint-disable-line no-empty
  }

  // Returns either a `string` value or `null` if the key doesn't exist.
  getState(key) {
    if (key in this._state) {
      return this._state[key];
    }
    return null;
  }

  removeState(key) {
    if (key in this._state) {
      delete this._state[key];
    }
  }

  setState(key, value) {
    this._state[key] = value;
  }
}
