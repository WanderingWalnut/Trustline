function normalizeBasePath(basePath) {
  if (!basePath || basePath === '/') {
    return undefined;
  }

  // Validate `basePath`.
  if (basePath[0] !== '/') {
    throw new Error('`basePath` must start with a slash');
  }

  // Remove trailing slash from `basePath`.
  if (basePath.slice(-1) === '/') {
    basePath = basePath.slice(0, -1);
  }

  return basePath;
}

function removeBasePathFromRelativeUrl(url, basePath) {
  if (url.indexOf(basePath) === 0) {
    // `farce` had a bug here:
    // `location.pathname` is supposed to always be non-empty.
    // If `basePath` is set to `/basePath` and the user navigates to `/basePath` URL,
    // originally here it would simply strips the whole string from the URL
    // and the result would be incorrect: `pathname: ""`.
    // The fix below is adding `|| '/'` in the `return` statement.
    // https://github.com/4Catalyzer/farce/issues/483
    return url.slice(basePath.length) || '/';
  }
  return url;
}

export function addBasePath(location, basePath) {
  basePath = normalizeBasePath(basePath);

  if (!basePath) {
    return location;
  }

  if (typeof location === 'string') {
    return `${basePath}${location}`;
  }

  return {
    ...location,
    pathname: `${basePath}${location.pathname}`,
  };
}

export function removeBasePath(location, basePath) {
  basePath = normalizeBasePath(basePath);

  if (!basePath) {
    return location;
  }

  if (typeof location === 'string') {
    return removeBasePathFromRelativeUrl(location, basePath);
  }

  return {
    ...location,
    pathname: removeBasePathFromRelativeUrl(location.pathname, basePath),
  };
}
