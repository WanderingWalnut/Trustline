import { stringify as stringifyQuery } from 'query-string';

export default function getLocationUrl({ pathname, search, query, hash }) {
  if (!search && query) {
    const queryString = stringifyQuery(query);
    if (queryString) {
      search = `?${queryString}`;
    }
  }

  return `${pathname}${search || ''}${hash || ''}`;
}
