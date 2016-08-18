/**
 * Actions
 */

import Enum from '../lib/enum';

export const registrationTypes = new Enum(
  'SET_METHOD',
  'GET_ENVIRONMENT',
  'GET_ENVIRONMENT_PENDING',
  'GET_ENVIRONMENT_SUCCESS',
  'GET_ENVIRONMENT_ERROR',
  'LOGIN',
  'LOGIN_PENDING',
  'LOGIN_SUCCESS',
  'LOGIN_ERROR'
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
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/sessions/environment')
        }
      };
    };
  },

  loginWithFacebook(token) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/sessions/facebook', {
            method: 'POST',
            body: {
              'facebook_token': token
            }
          })
        }
      };
    };
  },

  signupWithFacebook(token, type) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/users/facebook', {
            method: 'POST',
            body: {
              'facebook_token': token,
              user: {
                'account_type': type
              }
            }
          })
        }
      };
    };
  }
};
