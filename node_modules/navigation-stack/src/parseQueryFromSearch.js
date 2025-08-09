import { parse as parseQuery } from 'query-string';

export default function parseQueryFromSearch(search) {
  if (search.length > '?'.length) {
    try {
      return parseQuery(search.slice(1));
    } catch (error) {
      // Ignore any query parsing errors.
    }
  }
  return undefined;
}
