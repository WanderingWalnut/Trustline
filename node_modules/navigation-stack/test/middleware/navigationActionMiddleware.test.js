import ActionTypes from '../../src/ActionTypes';
import navigationActionMiddleware from '../../src/middleware/navigationActionMiddleware';

describe('navigationActionMiddleware', () => {
  let next;
  let dispatch;
  beforeEach(() => {
    next = sinon.spy();
    dispatch = navigationActionMiddleware()(next);
  });

  it('should change `type` of PUSH action', () => {
    dispatch({
      type: ActionTypes.PUSH,
      payload: {
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      },
    });

    expect(next).to.be.calledWith({
      type: ActionTypes.NAVIGATE,
      payload: {
        action: 'PUSH',
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      },
    });
  });

  it('should change `type` of REPLACE action', () => {
    dispatch({
      type: ActionTypes.REPLACE,
      payload: {
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      },
    });

    expect(next).to.be.calledWith({
      type: ActionTypes.NAVIGATE,
      payload: {
        action: 'REPLACE',
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      },
    });
  });

  it('should not affect other action', () => {
    const UNKNOWN = 'UNKNOWN';
    dispatch({
      type: UNKNOWN,
      payload: {
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      },
    });

    expect(next).to.be.calledWith({
      type: UNKNOWN,
      payload: {
        pathname: '/foo',
        search: '?bar=baz',
        hash: '#qux',
      },
    });
  });
});
