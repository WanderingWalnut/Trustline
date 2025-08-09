import ActionTypes from '../../src/ActionTypes';
import createTransformLocationMiddleware from '../../src/middleware/createTransformLocationMiddleware';

describe('createTransformLocationMiddleware', () => {
  const middleware = createTransformLocationMiddleware({
    transformInputLocation: (locationInput) => ({ locationInput }),
    transformEnvironmentLocation: (location) => ({ location }),
  });

  const dispatch = middleware()((action) => action.payload);

  it('should handle location descriptors for NAVIGATE', () => {
    expect(
      dispatch({
        type: ActionTypes.NAVIGATE,
        payload: {},
      }),
    ).to.eql({
      locationInput: {},
    });
  });

  it('should handle locations for UPDATE', () => {
    expect(
      dispatch({
        type: ActionTypes.UPDATE,
        payload: {},
      }),
    ).to.eql({
      location: {},
    });
  });

  it('should ignore other actions', () => {
    expect(
      dispatch({
        type: 'UNKNOWN',
        payload: { unknown: {} },
      }),
    ).to.eql({
      unknown: {},
    });
  });
});
