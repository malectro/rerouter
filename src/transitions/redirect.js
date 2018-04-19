// @flow

import type {Transition} from '../types';

import {AbortError} from '../errors';


export const createBrowserRedirectTransition = (
  history?: History,
): Transition => async ({routes}, resolution) => {
  const {path} = resolution;
  const redirect = getRedirect(routes, path);

  if (redirect) {
    resolution = await routes.resolve(redirect);

    if (history) {
      history.replaceState({}, '', redirect);
    }
  }

  return resolution;
};

export const createCustomRedirectTransition = (
  onRedirect: string => any,
): Transition => async ({routes}, resolution) => {
  const {path} = resolution;
  const redirect = getRedirect(routes, path);

  if (redirect) {
    onRedirect(redirect);
    throw new AbortError('Custom Redirect');
  }

  return resolution;
};

function getRedirect(routes, path) {
  const routePath = routes.getRoutePath(path);
  return routePath[routePath.length - 1].redirect;
}
