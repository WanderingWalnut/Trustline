import createBasePathMiddleware from '../../src/middleware/createBasePathMiddleware';
import {
  transformEnvironmentLocationUsingMiddleware,
  transformInputLocationUsingMiddleware,
} from '../helpers';

describe('createBasePathMiddleware', () => {
  [
    ['/foo', 'generic `basePath`'],
    ['/foo/', '`basePath` with a trailing slash'],
  ].forEach(([basePath, title]) => {
    describe(title, () => {
      const basePathMiddleware = createBasePathMiddleware(basePath);

      it('should prepend `basePath` to `location.pathname` on input locations', () => {
        expect(
          transformInputLocationUsingMiddleware(basePathMiddleware, {
            pathname: '/path',
          }),
        ).to.eql({
          pathname: '/foo/path',
        });
      });

      it('should strip `basePath` from `location.pathname` on environment locations', () => {
        expect(
          transformEnvironmentLocationUsingMiddleware(basePathMiddleware, {
            pathname: '/foo/path',
          }),
        ).to.eql({
          pathname: '/path',
        });
      });

      it('should handle unrecognized paths on environment locations', () => {
        expect(
          transformEnvironmentLocationUsingMiddleware(basePathMiddleware, {
            pathname: '/bar/path',
          }),
        ).to.eql({
          pathname: '/bar/path',
        });
      });
    });
  });

  describe('No `basePath` specified', () => {
    const basePathMiddleware = createBasePathMiddleware('/');

    it('should not modify `location.pathname` of input locations', () => {
      const location = { pathname: '/path' };
      expect(
        transformInputLocationUsingMiddleware(basePathMiddleware, location),
      ).to.equal(location);
    });

    it('should not modify `location.pathname` of environment locations', () => {
      const location = { pathname: '/path' };
      expect(
        transformEnvironmentLocationUsingMiddleware(
          basePathMiddleware,
          location,
        ),
      ).to.equal(location);
    });
  });
});
