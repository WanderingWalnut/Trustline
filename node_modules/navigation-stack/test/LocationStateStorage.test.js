import LocationStateStorage from '../src/LocationStateStorage';
import MemoryEnvironment from '../src/environment/MemoryEnvironment';

describe('LocationStateStorage', () => {
  let environment;
  let stateStorage;

  const location = {
    key: 'location:0',
  };

  beforeEach(() => {
    window.sessionStorage.clear();

    environment = new MemoryEnvironment('/initial-location');
    stateStorage = new LocationStateStorage(environment, {
      namespace: 'test',
    });
  });

  it('should read saved value for default key', () => {
    stateStorage.set(location, '', 1);

    expect(stateStorage.get(location, '')).to.equal(1);
    expect(stateStorage.get(location, 'foo')).to.be.undefined();
  });

  it('should read saved value for explicit key', () => {
    stateStorage.set(location, 'foo', [2, 3]);

    expect(stateStorage.get(location, 'foo')).to.eql([2, 3]);
    expect(stateStorage.get(location, '')).to.be.undefined();
  });

  it('should read undefined when value is missing', () => {
    expect(stateStorage.get(location, '')).to.be.undefined();
    expect(stateStorage.get(location, 'foo')).to.be.undefined();
  });

  it('should work with arbitrary types', () => {
    stateStorage.set(location, 'number', 1);
    stateStorage.set(location, 'boolean', true);
    stateStorage.set(location, 'string', 'state');
    stateStorage.set(location, 'array', [2, 3]);
    stateStorage.set(location, 'object', { a: 1 });
    stateStorage.set(location, 'null', null);

    expect(stateStorage.get(location, 'number')).to.equal(1);
    expect(stateStorage.get(location, 'boolean')).to.equal(true);
    expect(stateStorage.get(location, 'string')).to.equal('state');
    expect(stateStorage.get(location, 'array')).to.eql([2, 3]);
    expect(stateStorage.get(location, 'object')).to.eql({ a: 1 });
    expect(stateStorage.get(location, 'null')).to.be.null();
  });

  it('should support deleting values', () => {
    stateStorage.set(location, '', 1);
    expect(stateStorage.get(location, '')).to.equal(1);

    stateStorage.set(location, '', undefined);
    expect(stateStorage.get(location, '')).to.be.undefined();
  });

  it('should read undefined for invalid JSON', () => {
    window.sessionStorage.setItem('test|location:0', '[}');

    expect(stateStorage.get(location, '')).to.be.undefined();
  });

  it('should support fallback key', () => {
    stateStorage.set({}, '', 1);

    expect(stateStorage.get({}, '')).to.equal(1);
  });
});
