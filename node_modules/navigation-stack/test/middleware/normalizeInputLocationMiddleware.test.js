import ActionTypes from '../../src/ActionTypes';
import normalizeInputLocationMiddleware from '../../src/middleware/normalizeInputLocationMiddleware';

describe('normalizeInputLocationMiddleware', () => {
  let next;
  let dispatch;
  beforeEach(() => {
    next = sinon.spy();
    dispatch = normalizeInputLocationMiddleware()(next);
  });

  it('should transform input location of PUSH action (`string` to `object`)', () => {
    dispatch({
      type: ActionTypes.PUSH,
      payload: '/foo?bar=baz#qux',
    });

    expect(next).to.be.calledWith({
      type: ActionTypes.PUSH,
      payload: {
        pathname: '/foo',
        search: '?bar=baz',
        query: {
          bar: 'baz',
        },
        hash: '#qux',
      },
    });
  });

  it('should transform input location of REPLACE action (`string` to `object`)', () => {
    dispatch({
      type: ActionTypes.REPLACE,
      payload: '/foo?bar=baz#qux',
    });

    expect(next).to.be.calledWith({
      type: ActionTypes.REPLACE,
      payload: {
        pathname: '/foo',
        search: '?bar=baz',
        query: {
          bar: 'baz',
        },
        hash: '#qux',
      },
    });
  });

  it('should not affect other action', () => {
    const UNKNOWN = 'UNKNOWN';
    dispatch({
      type: UNKNOWN,
      payload: '/foo?bar=baz#qux',
    });

    expect(next).to.be.calledWith({
      type: UNKNOWN,
      payload: '/foo?bar=baz#qux',
    });
  });
});
