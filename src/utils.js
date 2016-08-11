import {LOADING, LOADING_ERROR} from './constants';

var is = (what, state) => {
  if (!state)
    return [];

  if (state.constructor !== Array)
    state = [state];

  var isList = [];

  state.forEach((v) => {
    if (v === LOADING)
      isList.push(v);
  });

  return !!isList.length;
};

export default {
  isLoading(state) {
    return is(LOADING, state);
  },
  isLoadingError(state) {
    return is(LOADING_ERROR, state);
  }
};
