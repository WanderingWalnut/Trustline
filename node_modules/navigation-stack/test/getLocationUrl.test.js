import getLocationUrl from '../src/getLocationUrl';

describe('getLocationUrl', () => {
  it('should get location URL (`pathname`, `search`, and `hash`)', () => {
    expect(
      getLocationUrl({
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      }),
    ).to.equal('/foo?bar=baz#qux');
  });

  it('should get location URL (no `search` but with `query`)', () => {
    expect(
      getLocationUrl({
        pathname: '/foo',
        query: {
          bar: 'baz',
        },
        hash: '#qux',
      }),
    ).to.equal('/foo?bar=baz#qux');
  });

  it('should get location URL (just `pathname`)', () => {
    expect(
      getLocationUrl({
        pathname: '/foo',
      }),
    ).to.equal('/foo');
  });
});
