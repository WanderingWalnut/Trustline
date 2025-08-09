import parseLocationUrl from '../src/parseLocationUrl';

describe('parseLocationUrl', () => {
  it('should create location from a URL', () => {
    expect(parseLocationUrl('/foo?bar=baz#qux')).to.deep.equal({
      pathname: '/foo',
      search: '?bar=baz',
      query: {
        bar: 'baz',
      },
      hash: '#qux',
    });
  });

  it('should create location from a URL (`search` is "?")', () => {
    expect(parseLocationUrl('/foo?#qux')).to.deep.equal({
      pathname: '/foo',
      search: '?',
      hash: '#qux',
    });
  });

  it('should create location from a URL (no `search` and no `hash`)', () => {
    expect(parseLocationUrl('/foo')).to.deep.equal({
      pathname: '/foo',
      search: '',
      hash: '',
    });
  });
});
