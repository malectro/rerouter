import {getComponents} from '../path';


describe('getComponents', () => {
  const routes = [
    {
      component: () => {},
      children: [{path: 'frogs', component: () => {}}],
    },
  ];

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
});
