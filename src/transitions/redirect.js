// @flow

import type {Transition} from '../types';

import {AbortError, ReplaceError} from '../errors';


export const browserRedirectTransition: Transition = async (
  {routes},
  resolution,
) => {
  const {path} = resolution;
  const redirect = getRedirect(routes, path);

  if (redirect) {
    throw new ReplaceError(redirect);
  }

  return resolution;
};

export const createCustomRedirectTransition = (
  onRedirect: string => mixed,
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
