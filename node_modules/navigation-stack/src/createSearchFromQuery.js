import { stringify as stringifyQuery } from 'query-string';

export default function createSearchFromQuery(query) {
  const queryString = stringifyQuery(query);
  if (queryString) {
    return `?${queryString}`;
  }
  return undefined;
}
