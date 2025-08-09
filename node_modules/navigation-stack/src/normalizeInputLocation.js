import createSearchFromQuery from './createSearchFromQuery';
import parseLocationUrl from './parseLocationUrl';
import parseQueryFromSearch from './parseQueryFromSearch';

// * If `location` is a string, it parses it into a `NormalizedInputLocation`.
// * If `location` is an object, it ensures that `search` and `hash` properties aren't `undefined`,
//   i.e. it "ensures" that the `location` object can be used as a `NormalizedInputLocation`.
export default function normalizeInputLocation(location) {
  if (typeof location === 'string') {
    return parseLocationUrl(location);
  }

  // Convert `query` property values to strings.
  if (location.query) {
    for (const key of Object.keys(location.query)) {
      location.query[key] = String(location.query[key]);
    }
  }

  // Create `query` from `search`.
  if (location.search && !location.query) {
    location = {
      ...location,
      query: parseQueryFromSearch(location.search),
    };
  }

  // Convert `query` object into a `search` string
  // if `query` is present but `search` is not.
  if (location.query && !location.search) {
    location = {
      ...location,
      search: createSearchFromQuery(location.query),
    };
  }

  // Set default values on `search` and `hash`
  // if those properties are not present.
  return {
    ...location,
    search: location.search || '',
    hash: location.hash || '',
  };
}
