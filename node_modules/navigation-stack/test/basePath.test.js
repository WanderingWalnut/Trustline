import { addBasePath, removeBasePath } from '../src/basePath';

describe('addBasePath', () => {
  it('should add `basePath` to location object', () => {
    expect(
      addBasePath(
        {
          pathname: '/foo',
          search: '?bar=baz',
          hash: '#qux',
        },
        '/base-path',
      ),
    ).to.deep.equal({
      pathname: '/base-path/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should add `basePath` to location object (`basePath` ends with a slash)', () => {
    expect(
      addBasePath(
        {
          pathname: '/foo',
          search: '?bar=baz',
          hash: '#qux',
        },
        '/base-path/',
      ),
    ).to.deep.equal({
      pathname: '/base-path/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should add `basePath` to location object (no `basePath` option)', () => {
    expect(
      addBasePath({
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      }),
    ).to.deep.equal({
      pathname: '/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should add `basePath` to location URL', () => {
    expect(addBasePath('/foo?bar=baz#qux', '/base-path')).to.equal(
      '/base-path/foo?bar=baz#qux',
    );
  });

  it('should add `basePath` to location URL (`basePath` ends with a slash)', () => {
    expect(addBasePath('/foo?bar=baz#qux', '/base-path/')).to.equal(
      '/base-path/foo?bar=baz#qux',
    );
  });

  it('should add `basePath` to location URL (no `basePath` option)', () => {
    expect(addBasePath('/foo?bar=baz#qux')).to.equal('/foo?bar=baz#qux');
  });
});

describe('removeBasePath', () => {
  it('should remove `basePath` from location object', () => {
    expect(
      removeBasePath(
        {
          pathname: '/base-path/foo',
          search: '?bar=baz',
          hash: '#qux',
        },
        '/base-path',
      ),
    ).to.deep.equal({
      pathname: '/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should remove `basePath` from location object (does not contain `basePath`)', () => {
    expect(
      removeBasePath(
        {
          pathname: '/foo',
          search: '?bar=baz',
          hash: '#qux',
        },
        '/base-path',
      ),
    ).to.deep.equal({
      pathname: '/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should remove `basePath` from location object (`basePath` ends with a slash)', () => {
    expect(
      removeBasePath(
        {
          pathname: '/base-path/foo',
          search: '?bar=baz',
          hash: '#qux',
        },
        '/base-path/',
      ),
    ).to.deep.equal({
      pathname: '/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should remove `basePath` from location object (no `basePath` option)', () => {
    expect(
      removeBasePath({
        pathname: '/base-path/foo',
        search: '?bar=baz',
        hash: '#qux',
      }),
    ).to.deep.equal({
      pathname: '/base-path/foo',
      search: '?bar=baz',
      hash: '#qux',
    });
  });

  it('should remove `basePath` from location URL', () => {
    expect(
      removeBasePath('/base-path/foo?bar=baz#qux', '/base-path'),
    ).to.equal('/foo?bar=baz#qux');
  });

  it('should remove `basePath` from location URL (does not contain `basePath`)', () => {
    expect(removeBasePath('/foo?bar=baz#qux', '/base-path')).to.equal(
      '/foo?bar=baz#qux',
    );
  });

  it('should remove `basePath` from location URL (`basePath` ends with a slash)', () => {
    expect(
      removeBasePath('/base-path/foo?bar=baz#qux', '/base-path/'),
    ).to.equal('/foo?bar=baz#qux');
  });

  it('should remove `basePath` from location URL (no `basePath` option)', () => {
    expect(removeBasePath('/base-path/foo?bar=baz#qux')).to.equal(
      '/base-path/foo?bar=baz#qux',
    );
  });
});
