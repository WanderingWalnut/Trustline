import getLocationUrl from './getLocationUrl';

export default class LocationStateStorage {
  constructor(environment, { namespace } = {}) {
    this._environment = environment;
    this._getFallbackLocationKey = getLocationUrl;
    this._stateKeyPrefix = namespace ? `${namespace}|` : '';
  }

  get(location, key) {
    const stateKey = this._getStateKey(location, key);

    try {
      const value = this._environment.getState(stateKey);
      // === null is probably sufficient.
      if (value === null) {
        return undefined;
      }

      // We want to catch JSON parse errors in case someone separately threw
      // junk into sessionStorage under our namespace.
      return JSON.parse(value);
    } catch (error) {
      // Pretend that the entry doesn't exist.
      return undefined;
    }
  }

  set(location, key, value) {
    const stateKey = this._getStateKey(location, key);

    if (value === undefined) {
      try {
        this._environment.removeState(stateKey);
      } catch (error) {
        // No need to handle errors here.
      }

      return;
    }

    // Unlike with read, we want to fail on invalid values here, since the
    // value here is provided by the caller of this method.
    const valueString = JSON.stringify(value);

    try {
      this._environment.setState(stateKey, valueString);
    } catch (error) {
      // No need to handle errors here either. If it didn't work, it didn't
      // work. We make no guarantees about actually saving the value.
    }
  }

  _getStateKey(location, key) {
    const locationKey = location.key || this._getFallbackLocationKey(location);
    const keyPrefix = `${this._stateKeyPrefix}${locationKey}`;
    return `${keyPrefix}|${key}`;
  }
}
