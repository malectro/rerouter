import {createLocation, resolveLocation, partsMatch} from '../utils';


describe('createLocation', () => {
  test('no param', () => {
    expect(createLocation()).toEqual({
      href: '',
      pathname: '',
      search: '',
      searchParams: new URLSearchParams(''),
      query: {},
      hash: '',
      state: null,
    });
  });

  test('string', () => {
    expect(createLocation('path-to-thing')).toEqual({
      href: 'path-to-thing',
      pathname: 'path-to-thing',
      search: '',
      searchParams: new URLSearchParams(''),
      query: {},
      hash: '',
      state: null,
    });
  });

  test('query', () => {
    const query = {
      filter: '1',
    };
    expect(
      createLocation({
        pathname: 'path-to-thing',
        query,
      }),
    ).toEqual({
      href: 'path-to-thing?filter=1',
      pathname: 'path-to-thing',
      search: '?filter=1',
      searchParams: new URLSearchParams(query),
      query,
      hash: '',
      state: null,
    });
  });
});

describe('resolveLocation', () => {
  const currentLocation = createLocation(
    new URL('https://kylejwarren.com/path/to/something?filter=1'),
  );

  test('change query', () => {
    const query = {filter: '2'};
    expect(
      resolveLocation(currentLocation, {
        ...currentLocation,
        query,
      }),
    ).toEqual({
      ...currentLocation,
      query,
      href: '/path/to/something?filter=2',
      search: '?filter=2',
      searchParams: new URLSearchParams(query),
    });
  });

  test('change searchParams', () => {
    const searchParams = new URLSearchParams({filter: '2'});
    expect(
      resolveLocation(currentLocation, {
        ...currentLocation,
        searchParams,
      }),
    ).toEqual({
      ...currentLocation,
      searchParams,
      href: '/path/to/something?filter=2',
      search: '?filter=2',
      query: {filter: '2'},
    });
  });
});

describe('partsMatch', () => {
  test('equal paths', () => {
    expect(partsMatch('/foo', '/foo')).toBeTruthy();
  });

  test('nonequal paths', () => {
    expect(partsMatch('/foo', '/bar')).toBeFalsy();
  });

  test('trailing slashes', () => {
    expect(partsMatch('/foo', '/foo/')).toBeTruthy();
    expect(partsMatch('/foo/', '/foo/')).toBeTruthy();
  });

  test('subsets match', () => {
    expect(partsMatch('/foo', '/foo/bar')).toBeTruthy();
    expect(partsMatch('/foo/', '/foo/bar')).toBeTruthy();
  });

  test('phony subsets don\'t match', () => {
    expect(partsMatch('/fooo', '/foo')).toBeFalsy();
    expect(partsMatch('/foo', '/fooo')).toBeFalsy();
    expect(partsMatch('/foo', '/bar/foo/baz')).toBeFalsy();
    expect(partsMatch('/bar/fo/', '/bar/fooo')).toBeFalsy();
  });
});
