/**
 * Actions
 */

import Enum from '../lib/enum';

export const registrationTypes = new Enum(
  'SET_METHOD',
  'GET_ENVIRONMENT',
  'GET_ENVIRONMENT_PENDING',
  'GET_ENVIRONMENT_SUCCESS',
  'GET_ENVIRONMENT_ERROR'
);

/**
 * Action creators
 */

export const registrationActions = {
  setMethod(method) {
    return {
      type: registrationTypes.SET_METHOD,
      payload: method
    };
  },

  getEnvironment() {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.GET_ENVIRONMENT,
        meta: {
          immediate: true
        },
        payload: {
          promise: fetch.fetch('/sessions/environment')
        }
      };
    };
  }
};
