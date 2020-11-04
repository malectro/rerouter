import {matchSync, matches, pathToRegex} from '../path';


const routes = [
  {
    element: 1,
    children: [
      {path: 'frogs', element: 2},
      {
        path: 'func',
        children: [
          {path: '', exact: true, element: 3},
          {path: 'hello', element: 4},
          {path: ':param1', exact: true, element: 7},
        ],
      },
      {
        path: 'trees(/:param1)',
        element: 6,
      },
      {
        path: '*',
        element: 5,
      },
    ],
  },
];

describe('matchSync', () => {
  test('matches * route', () => {
    expect(
      matchSync(routes, '/404')
    ).toEqual(
      [
        {
          params: {},
          parentPathname: '',
          part: undefined,
          pathname: '',
          route: routes[0],
        },
        {
          params: {},
          parentPathname: '',
          part: '*',
          pathname: '/404',
          route: routes[0].children[3],
        },
      ]
    );
  });

  test('matches param subpath', () => {
    expect(
      matchSync(routes, '/func/val')
    ).toEqual(
      [
        {
          params: {},
          parentPathname: '',
          part: undefined,
          pathname: '',
          route: routes[0],
        },
        {
          params: {},
          parentPathname: '',
          part: 'func',
          pathname: '/func',
          route: routes[0].children[1],
        },
        {
          params: {param1: 'val'},
          parentPathname: '/func',
          part: ':param1',
          pathname: '/val',
          route: routes[0].children[1].children[2],
        },
      ]
    );
  });

  test('matches route with optional subpath', () => {
    expect(
      matchSync(routes, '/trees')
    ).toEqual(
      [
        {
          params: {},
          parentPathname: '',
          part: undefined,
          pathname: '',
          route: routes[0],
        },
        {
          params: {},
          parentPathname: '',
          part: 'trees(/:param1)',
          pathname: '/trees',
          route: routes[0].children[2],
        },
      ]
    );
  });

  test('matches route with optional subpath against subpath param', () => {
    expect(
      matchSync(routes, '/trees/kyle')
    ).toEqual(
      [
        {
          params: {},
          parentPathname: '',
          part: undefined,
          pathname: '',
          route: routes[0],
        },
        {
          params: {param1: 'kyle'},
          parentPathname: '',
          part: 'trees(/:param1)',
          pathname: '/trees/kyle',
          route: routes[0].children[2],
        },
      ]
    );
  });
});

describe('pathToRegex', () => {
  test('converts', () => {
    expect(pathToRegex('root/:id/:id2/page(s)/*/page2(/:id3)')).toEqual({
      regex: /^\/?root\/([^/]+)\/([^/]+)\/page(?:s)?\/.*\/page2(?:\/([^/]+))?/,
      params: ['id', 'id2', 'id3'],
    });
  });

  test('single param', () => {
    expect(pathToRegex(':param')).toEqual({
      regex: /^\/?([^/]+)/,
      params: ['param'],
    });
  });
});

describe('matches', () => {
  test('exact', () => {
    expect(matches('root/:id', 'root/2')).toEqual(
      {
        length: 6,
        params: {
          id: '2',
        },
      },
    );
  });

  test('absolute slash', () => {
    expect(matches('root/:id', '/root/2')).toEqual(
      {
        length: 7,
        params: {
          id: '2',
        },
      },
    );
  });

  test('single param', () => {
    expect(matches(':id', '2')).toEqual(
      {
        length: 1,
        params: {
          id: '2',
        },
      },
    );
  });

  test('prefix', () => {
    expect(matches('root/:id', 'root/2/edit')).toEqual(
      {
        length: 6,
        params: {
          id: '2',
        },
      },
    );
  });

  test('optional suffix', () => {
    const path = 'root(/:id)';
    expect(matches(path, 'root/2')).toEqual(
      {
        length: 6,
        params: {
          id: '2',
        },
      },
    );
    expect(matches(path, 'root')).toEqual(
      {
        length: 4,
        params: {
          id: undefined,
        },
      },
    );
    expect(matches(path, 'root/2/kyle')).toEqual(
      {
        length: 6,
        params: {
          id: '2',
        },
      },
    );
  });
});
