import {matches, pathToRegex} from '../path';


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

describe('pathToRegex', () => {
  test('converts', () => {
    expect(pathToRegex('root/:id/:id2/page(s)/*/page2')).toEqual({
      regex: /^\/?root\/([^/]+)\/([^/]+)\/page(?:s)?\/.*\/page2/,
      params: ['id', 'id2'],
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
});
