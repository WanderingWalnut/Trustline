import delay from 'delay';
import pDefer from 'p-defer';
import { applyMiddleware, createStore } from 'redux';

import Actions from '../../src/Actions';
import addNavigationBlockerOriginal from '../../src/addNavigationBlocker';
import createMiddlewares from '../../src/createMiddlewares';
import MemoryEnvironment from '../../src/environment/MemoryEnvironment';
import locationReducer from '../../src/locationReducer';
import { shouldWarn } from '../helpers';

describe('createNavigationBlockerMiddleware', () => {
  const sandbox = sinon.createSandbox();

  let environment;
  let store;

  function addNavigationBlocker(listener) {
    return addNavigationBlockerOriginal(environment, listener);
  }

  beforeEach(() => {
    environment = new MemoryEnvironment('/foo');

    store = createStore(
      locationReducer,
      applyMiddleware(...createMiddlewares(environment)),
    );
    store.dispatch(Actions.init());

    sinon.spy(environment, 'addBeforeDestroyListener');
    sinon.spy(environment, '_removeBeforeDestroyListener');
  });

  afterEach(() => {
    store.dispatch(Actions.dispose());

    sandbox.restore();
  });

  describe('PUSH navigations', () => {
    it('should block navigation when blocker returns `true`', () => {
      const listener = sinon.stub().returns(true);
      addNavigationBlocker(listener);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      expect(listener.firstCall.args[0]).to.include({
        action: 'PUSH',
        pathname: '/bar',
      });
    });

    it('should allow navigation when blocker returns `undefined`', () => {
      addNavigationBlocker(() => undefined);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/bar');
    });

    it("should fall through when first blocker doesn't return `true`", () => {
      const listener1 = sinon.stub().returns(undefined);
      const listener2 = sinon.stub().returns(true);

      addNavigationBlocker(listener1);
      addNavigationBlocker(listener2);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      expect(listener1).to.have.been.calledOnce();
      expect(listener2).to.have.been.calledOnce();
    });

    it('should not fall through when first blocker returns `true`', () => {
      const listener1 = sinon.stub().returns(true);
      const listener2 = sinon.stub().returns(undefined);

      addNavigationBlocker(listener1);
      addNavigationBlocker(listener2);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      expect(listener1).to.have.been.calledOnce();
      expect(listener2).not.to.have.been.called();
    });

    it('should warn on and ignore listeners that throw', () => {
      shouldWarn(
        'Ignoring navigation blocker `syncListener` that failed with `Error: foo`.',
      );

      const syncListener = () => {
        throw new Error('foo');
      };

      addNavigationBlocker(syncListener);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/bar');
    });

    // it('should show a confirmation dialog and allow navigation on string', () => {
    //   sandbox.stub(window, 'confirm').returns(true);
    //
    //   addNavigationBlocker(({ pathname }) => pathname);
    //
    //   store.dispatch(Actions.push('/bar'));
    //   expect(store.getState().pathname).to.equal('/bar');
    //
    //   expect(window.confirm)
    //     .to.have.been.calledOnce()
    //     .and.to.have.been.called.with('/bar');
    // });

    // it('should show a confirmation dialog and block navigation on string', () => {
    //   sandbox.stub(window, 'confirm').returns(false);
    //
    //   addNavigationBlocker(({ pathname }) => pathname);
    //
    //   store.dispatch(Actions.push('/bar'));
    //   expect(store.getState().pathname).to.equal('/foo');
    //
    //   expect(window.confirm)
    //     .to.have.been.calledOnce()
    //     .and.to.have.been.called.with('/bar');
    // });

    it('should allow navigation when blocker returns `undefined` (async)', async () => {
      const deferred = pDefer();
      addNavigationBlocker(() => deferred.promise);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      deferred.resolve(undefined);
      await delay(10);

      expect(store.getState().pathname).to.equal('/bar');
    });

    it('should block navigation when blocker returns `true` (async)', async () => {
      const deferred = pDefer();
      addNavigationBlocker(() => deferred.promise);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      deferred.resolve(true);
      await delay(10);

      expect(store.getState().pathname).to.equal('/foo');
    });

    it('should allow chaining async blockers', async () => {
      const deferred1 = pDefer();
      const deferred2 = pDefer();

      addNavigationBlocker(() => deferred1.promise);
      addNavigationBlocker(() => deferred2.promise);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      deferred1.resolve(undefined);
      await delay(10);

      expect(store.getState().pathname).to.equal('/foo');

      deferred2.resolve(undefined);
      await delay(10);

      expect(store.getState().pathname).to.equal('/bar');
    });

    it('should warn on and ignore async blockers that throw an error', async () => {
      shouldWarn(
        'Ignoring navigation blocker `asyncListener` that failed with `Error: foo`.',
      );

      // eslint-disable-next-line require-await
      const asyncListener = async () => {
        throw new Error('foo');
      };

      addNavigationBlocker(asyncListener);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      await delay(10);

      expect(store.getState().pathname).to.equal('/bar');
    });

    it('should allow removing listeners', () => {
      const removeNavigationListener = addNavigationBlocker(() => true);

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/foo');

      removeNavigationListener();

      store.dispatch(Actions.push('/bar'));
      expect(store.getState().pathname).to.equal('/bar');
    });
  });

  describe('POP navigations', () => {
    beforeEach(() => {
      store.dispatch(Actions.push('/bar'));
    });

    it('should allow navigation when blocker returns `undefined`', () => {
      const listener = sinon.stub().returns(undefined);
      addNavigationBlocker(listener);

      store.dispatch(Actions.shift(-1));
      expect(store.getState().pathname).to.equal('/foo');

      expect(listener.firstCall.args[0]).to.include({
        action: 'POP',
        pathname: '/foo',
        delta: -1,
      });
    });

    it('should block navigation when blocker returns `true`', () => {
      addNavigationBlocker(() => true);

      store.dispatch(Actions.shift(-1));
      expect(store.getState().pathname).to.equal('/bar');
    });

    it('should allow navigation when blocker returns `undefined` (async)', async () => {
      const deferred = pDefer();
      addNavigationBlocker(() => deferred.promise);

      store.dispatch(Actions.shift(-1));
      expect(store.getState().pathname).to.equal('/bar');

      deferred.resolve(undefined);
      await delay(10);

      expect(store.getState().pathname).to.equal('/foo');
    });

    it('should block navigation when blocker returns `true` (async)', async () => {
      const deferred = pDefer();
      addNavigationBlocker(() => deferred.promise);

      store.dispatch(Actions.shift(-1));
      expect(store.getState().pathname).to.equal('/bar');

      deferred.resolve(true);
      await delay(10);

      expect(store.getState().pathname).to.equal('/bar');
    });

    // it('should show a confirmation dialog and allow navigation on string', () => {
    //   sandbox.stub(window, 'confirm').returns(true);
    //
    //   addNavigationBlocker(({ pathname }) => pathname);
    //
    //   store.dispatch(Actions.shift(-1));
    //   expect(store.getState().pathname).to.equal('/foo');
    //
    //   expect(window.confirm)
    //     .to.have.been.calledOnce()
    //     .and.to.have.been.called.with('/bar');
    // });

    it('should ignore the initial load when blocker returns `true`', () => {
      // Get rid of the old store. We'll replace it with a new one.
      store.dispatch(Actions.dispose());

      store = createStore(
        locationReducer,
        applyMiddleware(...createMiddlewares(new MemoryEnvironment('/foo'))),
      );
      addNavigationBlocker(() => true);

      expect(store.getState()).to.be.undefined();
      store.dispatch(Actions.init());
      expect(store.getState().pathname).to.equal('/foo');
    });

    it('should support async rewinding', async () => {
      // eslint-disable-next-line no-underscore-dangle
      const listener = environment._listener;

      let environmentDeferred;

      // eslint-disable-next-line no-underscore-dangle
      environment._listener = async (location) => {
        environmentDeferred = pDefer();
        await environmentDeferred.promise;

        listener(location);
      };

      const deferred = pDefer();
      addNavigationBlocker(() => deferred.promise);

      store.dispatch(Actions.shift(-1));

      // Environment popped, update to store blocked.
      expect(environment.init().pathname).to.equal('/foo');
      expect(store.getState().pathname).to.equal('/bar');

      environmentDeferred.resolve();
      await delay(10);

      // Environment rewinded.
      expect(environment.init().pathname).to.equal('/bar');
      expect(store.getState().pathname).to.equal('/bar');

      deferred.resolve(undefined);
      await delay(10);

      environmentDeferred.resolve();
      await delay(10);

      // Environment re-popped, update to store delayed.
      expect(environment.init().pathname).to.equal('/foo');
      expect(store.getState().pathname).to.equal('/foo');
    });

    it('should allow navigation without calling any blockers when `location.delta` is `null`', async () => {
      const deferred = pDefer();
      addNavigationBlocker(() => deferred.promise);

      // Update location with a `POP` action.
      /* eslint-disable no-underscore-dangle */
      environment._index = 0;
      environment._listener(environment.init(null));
      /* eslint-enable no-underscore-dangle */

      deferred.resolve(undefined);
      await delay(10);

      // Without delta, we can't rewind on the environment,
      // so navigation is allowed without calling any blockers.
      expect(environment.init().pathname).to.equal('/foo');
      expect(store.getState().pathname).to.equal('/foo');
    });

    // it('should allow navigation when blocker returns `undefined` and `location.delta` is `null`', async () => {
    //   const deferred = pDefer();
    //   addNavigationBlocker(() => deferred.promise);
    //
    //   // Update location with a `POP` action.
    //   /* eslint-disable no-underscore-dangle */
    //   environment._index = 0;
    //   environment._listener(environment.init(null));
    //   /* eslint-enable no-underscore-dangle */
    //
    //   // Without delta, we can't rewind on the environment.
    //   expect(environment.init().pathname).to.equal('/foo');
    //   expect(store.getState().pathname).to.equal('/bar');
    //
    //   deferred.resolve(undefined);
    //   await delay(10);
    //
    //   expect(environment.init().pathname).to.equal('/foo');
    //   expect(store.getState().pathname).to.equal('/foo');
    // });

    // it('should block store update when blocker returns `true` and `location.delta` is `null`', async () => {
    //   const deferred = pDefer();
    //   addNavigationBlocker(() => deferred.promise);
    //
    //   /* eslint-disable no-underscore-dangle */
    //   environment._index = 0;
    //   environment._listener(environment.init(null));
    //   /* eslint-enable no-underscore-dangle */
    //
    //   expect(environment.init().pathname).to.equal('/foo');
    //   expect(store.getState().pathname).to.equal('/bar');
    //
    //   deferred.resolve(true);
    //   await delay(10);
    //
    //   // These are out-of-sync now, but it's the best we can do.
    //   expect(environment.init().pathname).to.equal('/foo');
    //   expect(store.getState().pathname).to.equal('/bar');
    // });
  });

  describe('beforeUnload', () => {
    beforeEach(() => {
      // Get rid of the old store. We'll replace it with a new one.
      store.dispatch(Actions.dispose());

      sandbox.stub(window, 'addEventListener');
      sandbox.stub(window, 'removeEventListener');

      store = createStore(
        () => null,
        applyMiddleware(...createMiddlewares(environment)),
      );

      store.dispatch(Actions.init());
    });

    it('should manage event listener', () => {
      expect(environment.addBeforeDestroyListener).not.to.have.been.called();
      // expect(window.addEventListener).not.to.have.been.called();

      const removeNavigationListener1 = addNavigationBlocker(() => null, {
        beforeUnload: true,
      });
      expect(environment.addBeforeDestroyListener).to.have.been.calledOnce();
      // expect(window.addEventListener)
      //   .to.have.been.calledOnce()
      //   .and.to.have.been.called.with('beforeunload');

      const removeNavigationListener2 = addNavigationBlocker(() => null, {
        beforeUnload: true,
      });
      expect(environment.addBeforeDestroyListener).to.have.been.calledOnce();
      // expect(window.addEventListener)
      //   .to.have.been.calledOnce()
      //   .and.to.have.been.called.with('beforeunload');

      removeNavigationListener1();
      // expect(window.removeEventListener).not.to.have.been.called();
      expect(
        // eslint-disable-next-line no-underscore-dangle
        environment._removeBeforeDestroyListener,
      ).not.to.have.been.called();

      removeNavigationListener2();
      // expect(window.removeEventListener)
      //   .to.have.been.calledOnce()
      //   .and.to.have.been.called.with('beforeunload');
      expect(
        // eslint-disable-next-line no-underscore-dangle
        environment._removeBeforeDestroyListener,
      ).to.have.been.calledOnce();
    });

    it('should remove event listener on dispose', () => {
      addNavigationBlocker(() => null, { beforeUnload: true });
      // expect(window.removeEventListener).not.to.have.been.called();
      expect(
        // eslint-disable-next-line no-underscore-dangle
        environment._removeBeforeDestroyListener,
      ).not.to.have.been.called();

      store.dispatch(Actions.dispose());
      // expect(window.removeEventListener)
      //   .to.have.been.calledOnce()
      //   .and.to.have.been.called.with('beforeunload');
      expect(
        // eslint-disable-next-line no-underscore-dangle
        environment._removeBeforeDestroyListener,
      ).to.have.been.calledOnce();
    });

    it('should not add event listener without beforeUnload', () => {
      const removeNavigationListener = addNavigationBlocker(() => null);
      expect(window.addEventListener).not.to.have.been.called();

      removeNavigationListener();
      expect(window.removeEventListener).not.to.have.been.called();
    });
  });
});
