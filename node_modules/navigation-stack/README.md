# navigation-stack

[![npm version](https://img.shields.io/npm/v/navigation-stack.svg?style=flat-square)](https://www.npmjs.com/package/navigation-stack)
[![npm downloads](https://img.shields.io/npm/dm/navigation-stack.svg?style=flat-square)](https://www.npmjs.com/package/navigation-stack)

Handles navigation in a web browser. Represents web browser navigation history as a "stack" data structure. Provides operations to perform programmatic navigation such as "push" (go to new URL), "replace" (redirect to new URL), "shift" (rewind to a previously visited URL). Provides a subscription mechanism to get notified on current location change.

Originally forked from [`farce`](http://npmjs.com/package/farce) package to fix a [bug](https://github.com/4Catalyzer/farce/issues/483).

## Install

```
npm install navigation-stack
```

## Use

`navigation-stack` provides "middlewares", "actions" and a "reducer" that could be used with `redux` or any other `redux`-compatible package such as [`mini-redux`](https://www.npmjs.com/package/mini-redux).

```js
import { createStore, applyMiddleware } from 'redux'

import {
  createMiddlewares,
  locationReducer,
  Actions,
  BrowserEnvironment
} from 'navigation-stack'

const store = createStore(
  locationReducer, // Reducer function. For example, `locationReducer()`.
  applyMiddleware(...createMiddlewares(new BrowserEnvironment()))
)

store.dispatch(Actions.init())
```

After that, dispatch any of the `Actions` in order to navigate.

```js
// To navigate to a new page.
store.dispatch(Actions.push('/new/location'))

// To redirect to a new page.
store.dispatch(Actions.replace('/new/location'))

// To go back.
store.dispatch(Actions.shift(-1))

// To go forward.
store.dispatch(Actions.shift(1))
```

To view the current location:

```js
// When `locationReducer()` is used,
// `store.getState()` is the current location.
console.log(store.getState())
```

(optional) (advanced) Stop and clean up:

```js
store.dispatch(Actions.dispose())
```

## Current Location

To track the current location, the application could listen to `ActionTypes.UPDATE` action. The `payload` of the action is the current location.

For example, below is the source code for the default `locationReducer`.

```js
import { ActionTypes } from 'navigation-stack'

// With this reducer, `state` would always tell the current location.
function reducer(state, action) {
  if (action.type === ActionTypes.UPDATE) {
    // `action.payload` is the current location.
    return action.payload
  }
  return state
}
```

With this reducer, `store.getState()` will return the current location.

Calling `store.dispatch(Actions.init())` will trigger the initial `ActionTypes.UPDATE` action which will set the initial current location. From then on, the current location will always stay in sync with the web browser's URL bar, including "Back"/"Forward" navigation.

One could use Redux'es standard [subscription mechanisms](https://redux.js.org/api/store#subscribelistener) to immediately get notified of current location changes.

## Why Redux?

Why complicate things by providing "middlewares", "actions" and a "reducer" when it could be just a conventional API? That's because always knowing the "current location" means having to deal with "state management" in one way or another, and the simplest and most popular "state management" toolkit to date seems to be Redux.

If it was just about dispatching the `Actions` then of course it wouldn't require any "state management". But it's the "get current location" piece that changes the whole picture. One could say that using Redux for such a simple task is an overkill but actually reinventing a wheel is what I would consider "overkill". It's like crafting your own screwdriver just because the one from Walmart feels too bulky.

## Environment

```js
import {
  BrowserEnvironment,
  ServerEnvironment,
  MemoryEnvironment
} from 'navigation-stack'

new BrowserEnvironment()
new ServerEnvironment('/location-url')
new MemoryEnvironment('/location-url')
```

- Use `BrowserEnvironment` in a web browser.
- Use `ServerEnvironment` in server-side rendering.
- Use `MemoryEnvironment` in tests.
  - `MemoryEnvironment` supports an optional second argument — an `options` object with properties:
    - `save(state)` — Saves the environment state.
    - `load()` — Loads a previously-saved environment state.

## Base Path

If the web application is hosted under a certain URL prefix, it should be specified in `createMiddlewares()` call as `basePath` parameter.

```js
createMiddlewares(environment, { basePath?: '/base/path' })
```

## Location State Storage

One could use an environment-specific `LocationStateStorage` in order to store location-specific state. For example, one could store scroll position of a page and then restore that scroll position when the user decides to navigate "Back" to the page.

```js
import { BrowserEnvironment, LocationStateStorage } from 'navigation-stack'

const environment = new BrowserEnvironment()

const storage = new LocationStateStorage(environment, { namespace?: 'optional-namespace' })

const location = { pathname: '/abc' }

storage.set(location, 'key', 123)
storage.get(location, 'key') === 123
```

`LocationStateStorage` doesn't provide any guarantees about actually storing the data: if it encounters any errors in the process, it simply ignores them. This simplifies the API in a way that the application doesn't have to wrap `.get()`/`.set()` calls in a `try/catch` block. And judging by the nature of location-specific state, that type of data is inherently non-essential and rather "nice-to-have".

## Block Navigation

```js
import { createStore, applyMiddleware } from 'redux'

import {
  createMiddlewares,
  locationReducer,
  Actions,
  BrowserEnvironment,
  addNavigationBlocker
} from 'navigation-stack'

const environment = new BrowserEnvironment()

const store = createStore(
  locationReducer, // Reducer function. For example, `locationReducer()`.
  applyMiddleware(...createMiddlewares(environment))
)

store.dispatch(Actions.init())

const removeNavigationBlocker = addNavigationBlocker(
  environment,
  (newLocation) => {
    // Returning `true` means "block this navigation".
    return true
  }
);

// This navigation won't be performed.
store.dispatch(Actions.push('/new/location'))

// Disable the navigation blocker.
removeNavigationBlocker()

// This navigation now will be performed.
store.dispatch(Actions.push('/new/location'))
```

Navigation blocker should be a function that receives a `newLocation` argument and could be "synchronous" or "asynchronous" (i.e. return a `Promise`, aka `async`/`await`).

Navigation blockers fire both when navigating from one page to another and when closing the current browser tab. In the latter case, `newLocation` argument will be `null`, the function can't return a `Promise`, and returning `true` will cause the web browser to show a confirmation modal with a non-customizable browser-specific text.

## Utility

This package exports a couple of utility functions.

```js
import {
  addBasePath,
  removeBasePath,
  getLocationUrl,
  parseLocationUrl
} from 'navigation-stack'

// Parses a location URL to a location object.
// If there're no query parameters, `query` property will not be added.
parseLocationUrl('/abc?d=e') === {
  pathname: '/abc',
  search: '?d=e',
  query: { d: 'e' },
  hash: ''
}

// Converts a location object to a location URL.
getLocationUrl({ pathname: '/abc', search: '?d=e', hash: '' }) === '/abc?d=e'

// Adds `basePath` to a location object or a location URL.
addBasePath('/abc', '/base-path') === '/base-path/abc'
addBasePath({ pathname: '/abc' }, '/base-path') === { pathname: '/base-path/abc' }

// Removes `basePath` from a location object or a location URL.
// If `basePath` is not present in location, it won't do anything.
removeBasePath('/base-path/abc', '/base-path') === '/abc';
removeBasePath({ pathname: '/base-path/abc' }, '/base-path') === { pathname: '/abc' }
```

## Development

Clone the repository. Then:

```
yarn
yarn format
yarn test
```
