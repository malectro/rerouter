import {match, getComponents, pathToRegex} from '../path';


const routes = [
  {
    component: () => {},
    children: [
      {path: 'frogs', component: () => {}},
      {
        path: 'func',
        children: context => [
          context && {path: '', component: () => {}},
          context && context.hello ?
            {path: 'hello', component: () => {}}
            : {path: 'hi', component: () => {}},
        ],
      },
      {
        path: '*',
        component: () => {},
      },
    ],
  },
];

describe('match', () => {
  const notFoundPath = [
    {
      routeIndex: 0,
      part: undefined,
      params: {},
    },
    {routeIndex: 2, part: '*', params: {}},
  ];

  test('404', async () => {
    const path = await match(routes, 'bad/path');
    expect(path).toEqual(notFoundPath);
  });

  test('404 functional children', async () => {
    const path = await match(routes, 'func');
    expect(path).toEqual(notFoundPath);
  });

  test('valid functional children', async () => {
    const path = await match(routes, 'func', true);
    expect(path).toEqual([
      {
        routeIndex: 0,
        part: undefined,
        params: {},
      },
      {routeIndex: 1, part: 'func', params: {}},
      {routeIndex: 0, part: '', params: {}},
    ]);
  });
});

describe('getComponents', () => {
  test('builds a path', () => {
    const path = [
      {routeIndex: 0, params: {}, part: null},
      {routeIndex: 0, params: {}, part: 'frogs'},
    ];

    expect(getComponents(path, routes)).toEqual([
      routes[0].component,
      routes[0].children[0].component,
    ]);
  });

  test('path to 404', () => {
    const path = [
      {routeIndex: 0, params: {}, part: null},
      {routeIndex: 2, params: {}, part: '*'},
    ];

    expect(getComponents(path, routes)).toEqual([
      routes[0].component,
      routes[0].children[2].component,
    ]);
  });
});

describe('pathToRegex', () => {
  test('converts', () => {
    expect(pathToRegex('root/:id/:id2/page(s)/*/page2')).toEqual({
      regex: /^\/?root\/([^/]+)\/([^/]+)\/page(?:s)?\/.*\/page2/,
      params: ['id', 'id2'],
    });
  });
});
