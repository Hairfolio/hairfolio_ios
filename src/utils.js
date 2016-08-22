import {LOADING, LOADING_ERROR, READY} from './constants';

var is = (what, state) => {
  if (!state)
    return false;

  if (state.constructor !== Array)
    state = [state];

  var isList = [];

  state.forEach((v) => {
    if (v === what)
      isList.push(v);
  });

  return !!isList.length;
};

export default {
  isReady(state) {
    return is(READY, state);
  },
  isLoading(state) {
    return is(LOADING, state);
  },
  isLoadingError(state) {
    return is(LOADING_ERROR, state);
  },
  parseJSON(response) {
    if (response.json)
      return response.json().then((json) => {
        response.jsonData = json;
        return response;
      }, () => response);
    return response;
  }
};
