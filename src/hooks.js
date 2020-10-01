// @flow

import {useSelector} from 'react-redux';


export function useRouter() {
  return useSelector(selectRouter);
}

export function useLocation() {
  return useRouter().location;
}

function selectRouter(state) {
  return state.router;
}
