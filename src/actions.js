// actions
export const PUSH = '@@router/push';
export const REPLACE = '@@router/replace';
export const POP = '@@router/pop';
export const HANDLE_POP = '@@router/handlePop';


// action creators
export const push = location => ({
  type: PUSH,
  payload: location,
});

export const replace = location => ({
  type: REPLACE,
  payload: location,
});

export const pop = () => ({
  type: POP,
});

export const handlePop = () => ({
  type: HANDLE_POP,
});

