import {match, getComponents, pathToRegex} from '../path';


const routes = [
  {
    component: () => {},
    children: [
      {path: 'frogs', component: () => {}},
      {
        path: '*',
        component: () => {},
      },
    ],
  },
];

describe('match', () => {
  test('404', () => {
    const path = match(routes, 'bad/path');
    expect(path).toEqual([
      {
        routeIndex: 0,
        params: {},
      },
      {routeIndex: 1, part: '*', params: {}},
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
      {routeIndex: 1, params: {}, part: '*'},
    ];

    expect(getComponents(path, routes)).toEqual([
      routes[0].component,
      routes[0].children[1].component,
    ]);
  });
});

describe('pathToRegex', () => {
  test('converts', () => {
    expect(pathToRegex('root/:id/:id2/page/*/page2')).toEqual({
      regex: /^\/?root\/([^/]+)\/([^/]+)\/page\/.*\/page2/,
      params: ['id', 'id2'],
    });
  });
});
