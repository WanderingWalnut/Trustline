import * as exports from '../src';

describe('index', () => {
  it('should export top level correctly', () => {
    expect(exports.Actions).to.exist();
    expect(exports.ActionTypes).to.exist();
    expect(exports.addBasePath).to.exist();
    expect(exports.removeBasePath).to.exist();
    expect(exports.getLocationUrl).to.exist();
    expect(exports.parseLocationUrl).to.exist();
    expect(exports.addNavigationBlocker).to.exist();
    expect(exports.getLocationUrl).to.exist();
    expect(exports.parseLocationUrl).to.exist();
    expect(exports.createMiddlewares).to.exist();
    expect(exports.locationReducer).to.exist();
    expect(exports.BrowserEnvironment).to.exist();
    expect(exports.MemoryEnvironment).to.exist();
    expect(exports.ServerEnvironment).to.exist();
  });
});
