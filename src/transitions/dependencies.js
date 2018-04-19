// @flow

import type {ReduxStore, Location, Path, Params} from '../types';

import Routes from '../routes';


export const createTransition = <D: Object>(dependencyLocals?: D) => async (
  {
    routes,
    store,
    location,
  }: {routes: Routes, store: ReduxStore, location: Location},
  {path, params}: {path: Path, params: Params},
) => {
  // TODO (kyle): make this standard to the rerouter lib
  // TODO (kyle): possibly have the app use Suspense for this
  const dependencies = routes
    .getComponents(path)
    .map(component => component['@@redial-hooks'])
    .filter(Boolean);

  const dependencyParams = {
    params,
    location,
    store,
    dispatch: store.dispatch,
    getState: store.getState,
    ...dependencyLocals,
  };

  try {
    await resolveDependencies(dependencies, 'required', dependencyParams);
  } catch (error) {
    // TODO (kyle): 500
    console.error('Error fetching required', error);
    return {path, params};
  }

  try {
    const deferred = resolveDependencies(
      dependencies,
      'deferred',
      dependencyParams,
      true,
    );

    if (typeof window === 'undefined') {
      await deferred;
    } else {
      resolveDependencies(dependencies, 'clientSide', dependencyParams, true);
    }
  } catch (error) {
    console.error('Error fetching deferred', error);
  }

  return {path, params};
};
export default createTransition;

function resolveDependencies(dependencies, name, params, handleErrors = false) {
  let promise = Promise.all(
    dependencies
      .map(deps => deps[name])
      .filter(Boolean)
      .map(resolver => resolver(params)),
  );

  if (handleErrors) {
    promise = promise.catch(error => {
      console.error('Error fetching', error);
    });
  }

  return promise;
}
