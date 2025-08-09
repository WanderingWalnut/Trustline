import ServerEnvironment from '../../src/environment/ServerEnvironment';

describe('ServerEnvironment', () => {
  it('should parse the initial location', () => {
    const environment = new ServerEnvironment('/foo?bar=baz#qux');

    expect(environment.init()).to.eql({
      action: 'POP',
      pathname: '/foo',
      search: '?bar=baz',
      query: {
        bar: 'baz',
      },
      hash: '#qux',
    });
  });

  it('should have dummy support for subscriptions', () => {
    const environment = new ServerEnvironment('/foo?bar=baz#qux');
    const unsubscribe = environment.subscribe();
    expect(unsubscribe).to.not.throw();
  });
});
