import {matchSync, matches, pathToRegex} from '../path';


const routes = [
  {
    element: 1,
    children: [
      {path: 'frogs', element: 2},
      {
        path: 'func',
        children: [
          {path: '', element: 3},
          {path: 'hello', element: 4}
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
