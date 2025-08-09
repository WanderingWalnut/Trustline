import MemoryEnvironment from '../../src/environment/MemoryEnvironment';

const STATE_KEY = '@@navigation-stack/environment-state';

function save(state) {
  window.sessionStorage.setItem(STATE_KEY, state);
}

function load() {
  return window.sessionStorage.getItem(STATE_KEY);
}

describe('MemoryEnvironment', () => {
  it('should parse the initial location', () => {
    const environment = new MemoryEnvironment('/foo?bar=baz#qux');

    expect(environment.init()).to.eql({
      action: 'POP',
      pathname: '/foo',
      search: '?bar=baz',
      query: {
        bar: 'baz',
      },
      hash: '#qux',
      index: 0,
      delta: 0,
    });
  });

  it('should support basic navigation', () => {
    const environment = new MemoryEnvironment('/foo');

    const listener = sinon.spy();
    environment.subscribe(listener);

    const barLocation = environment.navigate({
      action: 'PUSH',
      pathname: '/bar',
      state: { the: 'state' },
    });

    expect(barLocation).to.deep.include({
      action: 'PUSH',
      pathname: '/bar',
      index: 1,
      delta: 1,
      state: { the: 'state' },
    });
    expect(barLocation.key).not.to.be.empty();

    expect(
      environment.navigate({ action: 'PUSH', pathname: '/baz' }),
    ).to.include({
      action: 'PUSH',
      pathname: '/baz',
      index: 2,
      delta: 1,
    });

    expect(
      environment.navigate({ action: 'REPLACE', pathname: '/qux' }),
    ).to.include({
      action: 'REPLACE',
      pathname: '/qux',
      index: 2,
      delta: 0,
    });

    expect(listener).not.to.have.been.called();

    environment.shift(-1);

    expect(listener).to.have.been.calledOnce();
    expect(listener.firstCall.args[0]).to.deep.include({
      action: 'POP',
      pathname: '/bar',
      key: barLocation.key,
      index: 1,
      delta: -1,
      state: { the: 'state' },
    });
  });

  it('should support subscribing and unsubscribing', () => {
    const environment = new MemoryEnvironment('/foo');
    environment.navigate({ action: 'PUSH', pathname: '/bar' });
    environment.navigate({ action: 'PUSH', pathname: '/baz' });

    const listener = sinon.spy();
    const unsubscribe = environment.subscribe(listener);

    environment.shift(-1);

    expect(listener).to.have.been.calledOnce();
    expect(listener.firstCall.args[0]).to.include({
      action: 'POP',
      pathname: '/bar',
    });
    listener.resetHistory();

    unsubscribe();

    environment.shift(-1);

    expect(listener).not.to.have.been.called();
  });

  it('should respect stack bounds', () => {
    const environment = new MemoryEnvironment('/foo');
    environment.navigate({ action: 'PUSH', pathname: '/bar' });
    environment.navigate({ action: 'PUSH', pathname: '/baz' });

    const listener = sinon.spy();
    environment.subscribe(listener);

    environment.shift(-390);

    expect(listener).to.have.been.calledOnce();
    expect(listener.firstCall.args[0]).to.include({
      action: 'POP',
      pathname: '/foo',
      delta: -2,
    });
    listener.resetHistory();

    environment.shift(-1);

    expect(listener).not.to.have.been.called();

    environment.shift(+22);

    expect(listener).to.have.been.calledOnce();
    expect(listener.firstCall.args[0]).to.include({
      action: 'POP',
      pathname: '/baz',
      delta: 2,
    });
    listener.resetHistory();

    environment.shift(+1);

    expect(listener).not.to.have.been.called();
  });

  it('should reset forward entries on push', () => {
    const environment = new MemoryEnvironment('/foo');
    environment.navigate({ action: 'PUSH', pathname: '/bar' });
    environment.navigate({ action: 'PUSH', pathname: '/baz' });
    environment.shift(-2);
    environment.navigate({ action: 'REPLACE', pathname: '/qux' });

    const listener = sinon.spy();
    environment.subscribe(listener);

    environment.shift(+1);

    expect(listener).to.have.been.calledOnce();
    expect(listener.firstCall.args[0]).to.include({
      action: 'POP',
      pathname: '/bar',
      delta: 1,
    });
  });

  it('should not reset forward entries on replace', () => {
    const environment = new MemoryEnvironment('/foo');
    environment.navigate({ action: 'PUSH', pathname: '/bar' });
    environment.navigate({ action: 'PUSH', pathname: '/baz' });
    environment.shift(-2);
    environment.navigate({ action: 'PUSH', pathname: '/qux' });

    const listener = sinon.spy();
    environment.subscribe(listener);

    environment.shift(+1);

    expect(listener).not.to.have.been.called();
  });

  describe('persistence', () => {
    beforeEach(() => {
      window.sessionStorage.clear();
    });

    it('should support persistence', () => {
      const environment1 = new MemoryEnvironment('/foo', { save, load });
      expect(environment1.init()).to.include({
        pathname: '/foo',
      });

      environment1.navigate({ action: 'PUSH', pathname: '/bar' });
      environment1.navigate({ action: 'PUSH', pathname: '/baz' });
      environment1.shift(-1);

      const environment2 = new MemoryEnvironment('/foo', { save, load });
      expect(environment2.init()).to.include({
        pathname: '/bar',
      });

      environment2.shift(+1);
      expect(environment2.init()).to.include({
        pathname: '/baz',
      });
    });

    it('should ignore broken session storage entry', () => {
      sessionStorage.setItem(
        '@@navigation-stack/state',
        JSON.stringify({ stack: [], index: 2 }),
      );

      const environment = new MemoryEnvironment('/foo', { save, load });
      expect(environment.init()).to.include({
        pathname: '/foo',
      });
    });
  });
});
