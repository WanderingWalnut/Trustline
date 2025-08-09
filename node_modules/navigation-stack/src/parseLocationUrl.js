import parseQueryFromSearch from './parseQueryFromSearch';

export default function parseLocationUrl(url) {
  if (url[0] !== '/') {
    throw new Error('Expected URL to start with a slash');
  }

  let remainingPath = url;

  const hashIndex = remainingPath.indexOf('#');
  let hash;
  if (hashIndex !== -1) {
    hash = remainingPath.slice(hashIndex);
    remainingPath = remainingPath.slice(0, hashIndex);
  } else {
    hash = '';
  }

  const searchIndex = remainingPath.indexOf('?');
  let search;
  if (searchIndex !== -1) {
    search = remainingPath.slice(searchIndex);
    remainingPath = remainingPath.slice(0, searchIndex);
  } else {
    search = '';
  }

  const location = {
    pathname: remainingPath,
    search,
    hash,
  };

  const query = parseQueryFromSearch(search);
  if (query) {
    location.query = query;
  }

  return location;
}
