import ActionTypes from '../src/ActionTypes';

describe('ActionTypes', () => {
  it('should have the correct exports', () => {
    expect(ActionTypes.INIT).to.exist();
    expect(ActionTypes.PUSH).to.exist();
    expect(ActionTypes.REPLACE).to.exist();
    expect(ActionTypes.NAVIGATE).to.exist();
    expect(ActionTypes.SHIFT).to.exist();
    expect(ActionTypes.UPDATE).to.exist();
    expect(ActionTypes.DISPOSE).to.exist();
  });
});
