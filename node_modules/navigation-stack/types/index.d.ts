// TypeScript Version: 3.0

export {};

export type Query = Record<string, string>;

// `InputLocationQuery` may specify query parameter values as any type of data.
// Those values will later be converted to strings.
export type InputLocationQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface Location<TState = any> {
  /**
   * 'PUSH' or 'REPLACE' if the location was reached via FarceActions.push or
   * FarceActions.replace respectively; 'POP' on the initial location, or if
   * the location was reached via the browser back or forward buttons or
   * via FarceActions.shift
   */
  action: 'PUSH' | 'REPLACE' | 'POP';
  /**
   * the path name; as on window.location e.g. '/foo'
   */
  pathname: string;
  /**
   * map version of search string
   */
  query: Query;
  /**
   * the search string; as on window.location e.g. '?bar=baz'
   */
  search: string;
  /**
   * the location hash; as on window.location e.g. '#qux'
   */
  hash: string;
  /**
   * if present, a unique key identifying the current history entry
   */
  key?: string;
  /**
   * the current index of the history entry, starting at 0 for the initial
   * entry; this increments on FarceActions.push but not on
   * FarceActions.replace
   */
  index: number;
  /**
   * the difference between the current index and the index of the previous
   * location
   */
  delta: number;
  /**
   * additional location state that is not part of the URL
   */
  state: TState;
}

/**
 * Location descriptor object used in #push and #replace.
 */
export interface InputLocationObject {
  pathname: Location['pathname'];
  search?: Location['search'];
  query?: InputLocationQuery;
  hash?: Location['hash'];
  state?: Location['state'];
}

export interface LocationBase {
  pathname: Location['pathname'];
  search: Location['search'];
  query?: Query;
  hash: Location['hash'];
  state?: Location['state'];
}

/**
 * Location descriptor string:
 *  store.dispatch(FarceActions.push('/foo?bar=baz#qux'));
 *
 * Equivalent location descriptor object:
 *    store.dispatch(FarceActions.push({
 *     pathname: '/foo',
 *     search: '?bar=baz',
 *     hash: '#qux',
 *   }));
 *
 * https://github.com/4Catalyzer/farce#locations-and-location-descriptors
 */
export type InputLocationString = string;

// Using an interface allows consumers to use object merging to add other
//  location descriptor types.
export interface InputLocationTypes {
  object: InputLocationObject;
  string: InputLocationString;
}

export type InputLocation = InputLocationTypes[keyof InputLocationTypes];

export interface CreateMiddlewaresOptions {
  basePath?: string;
}

export type NavigationBlockerSyncResult = boolean | undefined;
export type NavigationBlockerResult =
  | NavigationBlockerSyncResult
  | Promise<NavigationBlockerSyncResult>;

/**
 * The navigation listener function receives the `location` to which the user
 * is attempting to navigate.
 *
 * The `location` argument is `null` when the web browser tab is about to be closed.
 */
export interface NavigationBlocker {
  (location: Location | LocationBase | null): NavigationBlockerResult;
}

export function addBasePath<L extends InputLocation>(
  location: L,
  basePath?: string,
): L;
export function removeBasePath<L extends InputLocation>(
  location: L,
  basePath?: string,
): L;

export function getLocationUrl(location: InputLocationObject): string;
export function parseLocationUrl(locationUrl: string): LocationBase;

export function createMiddlewares(
  environment: Environment,
  options?: CreateMiddlewaresOptions,
): Middleware[];

export function addNavigationBlocker(
  environment: EnvironmentBase,
  blocker: NavigationBlocker,
): () => void;

export const ActionTypes: {
  INIT: '@@navigation-stack/INIT';
  PUSH: '@@navigation-stack/PUSH';
  REPLACE: '@@navigation-stack/REPLACE';
  NAVIGATE: '@@navigation-stack/NAVIGATE';
  SHIFT: '@@navigation-stack/SHIFT';
  UPDATE: '@@navigation-stack/UPDATE';
  DISPOSE: '@@navigation-stack/DISPOSE';
};

export interface InitAction {
  type: (typeof ActionTypes)['INIT'];
}

export interface PushAction {
  type: (typeof ActionTypes)['PUSH'];
  payload: InputLocation;
}

export interface ReplaceAction {
  type: (typeof ActionTypes)['REPLACE'];
  payload: InputLocation;
}

export interface RewindAction {
  type: (typeof ActionTypes)['SHIFT'];
  payload: number;
}

export interface DisposeAction {
  type: (typeof ActionTypes)['DISPOSE'];
}

export type Action =
  | InitAction
  | PushAction
  | ReplaceAction
  | RewindAction
  | DisposeAction;

export const Actions: {
  init(): InitAction;
  push(location: InputLocation): PushAction;
  replace(location: InputLocation): ReplaceAction;
  go(delta: number): RewindAction;
  dispose(): DisposeAction;
};

type BeforeDestroyListener = () => boolean | undefined;

export interface Environment {
  init(): void;

  // Subscribes to changes in location,
  // excluding ones that happened as a result of calling `.navigate()`.
  subscribe(listener: (location: Location) => void): () => void;

  navigate(location: LocationBase): Location;

  go(delta: number): void;

  addBeforeDestroyListener(listener: BeforeDestroyListener): void;

  getState(key: string): string | null;
  removeState(key: string): void;
  setState(key: string, value: string): void;
}

// This is just a copy-paste of the `Environment` interface above.
declare abstract class EnvironmentBase implements Environment {
  init(): void;

  // Subscribes to changes in location,
  // excluding ones that happened as a result of calling `.navigate()`.
  subscribe(listener: (location: Location) => void): () => void;

  navigate(location: LocationBase): Location;

  go(delta: number): void;

  addBeforeDestroyListener(listener: BeforeDestroyListener): void;

  getState(key: string): string | null;
  removeState(key: string): void;
  setState(key: string, value: string): void;
}

export class BrowserEnvironment extends EnvironmentBase {}

export interface MemoryEnvironmentOptions<MemoryEnvironmentState = any> {
  save?: (state: MemoryEnvironmentState) => void;
  load?: () => MemoryEnvironmentState | undefined | null;
}

export class ServerEnvironment extends EnvironmentBase {
  constructor(initialLocation: InputLocation);
}

export class MemoryEnvironment extends EnvironmentBase {
  constructor(
    initialLocation: InputLocation,
    options?: MemoryEnvironmentOptions,
  );
}

export interface QueryMiddlewareOptions {
  stringify(query: InputLocationQuery): string;
  parse(str: string): Query;
}

export function createQueryMiddleware(
  options: QueryMiddlewareOptions,
): Middleware;

export const queryMiddleware: Middleware;

export function createBasePathMiddleware(basePath?: string): Middleware;

export const locationReducer: Reducer<Location, Action>;

export class LocationStateStorage {
  constructor(environment: Environment, options?: { namespace?: string });

  get(location: Location, key: string): any;
  set(location: Location, key: string, value: any): void;
}

// The following types are copy-pasted from `redux`.

interface ReduxAction<T = any> {
  type: T;
}

interface AnyAction extends ReduxAction {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}

interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D;
  getState(): S;
}

interface Middleware<
  DispatchExt = {},
  S = any,
  D extends Dispatch = Dispatch,
> {
  (api: MiddlewareAPI<D, S>): (next: Dispatch) => (action: any) => any;
}

type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A,
) => S;
