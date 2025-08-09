import { addBasePath, removeBasePath } from '../basePath';
import createTransformLocationMiddleware from './createTransformLocationMiddleware';

// Creates a "middleware" that, when a website is hosted under a certain path (`basePath`),
// automatically strips that starting segment from the `pathname` of `location`s.
export default function createBasePathMiddleware(basePath) {
  return createTransformLocationMiddleware({
    // Transforms input `Location`:
    // prepends `basePath` to the URL.
    transformInputLocation: (location) => {
      return addBasePath(location, basePath);
    },

    // Transforms environment `Location` object:
    // removes `basePath` from the URL.
    transformEnvironmentLocation: (location) => {
      return removeBasePath(location, basePath);
    },
  });
}
