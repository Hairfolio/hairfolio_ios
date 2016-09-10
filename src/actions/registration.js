/**
 * Actions
 */

import Enum from '../lib/enum';
import utils from '../utils';
import {throwOnFail} from '../lib/reduxPromiseMiddleware';

export const registrationTypes = new Enum(
  'SET_METHOD',
  'GET_ENVIRONMENT',
  'GET_ENVIRONMENT_PENDING',
  'GET_ENVIRONMENT_SUCCESS',
  'GET_ENVIRONMENT_ERROR',
  'GET_CERTIFICATES',
  'GET_CERTIFICATES_PENDING',
  'GET_CERTIFICATES_SUCCESS',
  'GET_CERTIFICATES_ERROR',
  'GET_EXPERIENCES',
  'GET_EXPERIENCES_PENDING',
  'GET_EXPERIENCES_SUCCESS',
  'GET_EXPERIENCES_ERROR',
  'HYDRATE_USER_EDUCATION',
  'HYDRATE_USER_EDUCATION_PENDING',
  'HYDRATE_USER_EDUCATION_SUCCESS',
  'HYDRATE_USER_EDUCATION_ERROR',
  'LOGIN_FULL',
  'LOGIN_FULL_PENDING',
  'LOGIN_FULL_SUCCESS',
  'LOGIN_FULL_ERROR',
  'LOGIN',
  'LOGIN_PENDING',
  'LOGIN_SUCCESS',
  'LOGIN_ERROR',
  'FORGOT_PASSWORD',
  'FORGOT_PASSWORD_PENDING',
  'FORGOT_PASSWORD_SUCCESS',
  'FORGOT_PASSWORD_ERROR',
  'EDIT_USER',
  'EDIT_USER_PENDING',
  'EDIT_USER_SUCCESS',
  'EDIT_USER_ERROR',
  'LOGOUT'
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

  hydrateUserEducation() {
    return ({services: {fetch}, getState}) =>
      ({
        type: registrationTypes.HYDRATE_USER_EDUCATION,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/educations`)
        }
      });
  },

  getEnvironment() {
    return ({getState, services: {fetch}}) => {
      return {
        type: registrationTypes.GET_ENVIRONMENT,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: utils.isReady(getState().environment.state) ?
            Promise.resolve(getState().environment.environment.toJS())
          :
            fetch.fetch('/sessions/environment')
        }
      };
    };
  },

  getCertificates() {
    return ({getState, services: {fetch}}) => {
      return {
        type: registrationTypes.GET_CERTIFICATES,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: utils.isReady(getState().environment.certificatesState) ?
            Promise.resolve(getState().environment.certificates.toJS())
          :
            fetch.fetch('/certificates')
        }
      };
    };
  },
  getExperiences() {
    return ({getState, services: {fetch}}) => {
      return {
        type: registrationTypes.GET_EXPERIENCES,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: utils.isReady(getState().environment.experiencesState) ?
            Promise.resolve(getState().environment.experiences.toJS())
          :
            fetch.fetch('/experiences')
        }
      };
    };
  },

  forgotPassword(email) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.FORGOT_PASSWORD,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/sessions/forgot_pwd', {
            method: 'POST',
            body: {email}
          })
        }
      };
    };
  },

  loginWithFacebookBase(token) {
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

  loginWithFacebook(token) {
    return ({services: {fetch}, dispatch, getState}) => {
      return {
        type: registrationTypes.LOGIN_FULL,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: dispatch(registrationActions.loginWithFacebookBase(token))
            .then(throwOnFail)
            .then(() => dispatch(registrationActions.hydrateUserEducation()))
            .then(throwOnFail)
            .then(() => getState().user.data)
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
  },

  loginWithInstagramBase(token) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/sessions/instagram', {
            method: 'POST',
            body: {
              'insta_token': token
            }
          })
        }
      };
    };
  },

  loginWithInstagram(token) {
    return ({services: {fetch}, dispatch, getState}) => {
      return {
        type: registrationTypes.LOGIN_FULL,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: dispatch(registrationActions.loginWithInstagramBase(token))
            .then(throwOnFail)
            .then(() => dispatch(registrationActions.hydrateUserEducation()))
            .then(throwOnFail)
            .then(() => getState().user.data)
        }
      };
    };
  },

  signupWithInstagram(token, type) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/users/instagram', {
            method: 'POST',
            body: {
              'insta_token': token,
              user: {
                'account_type': type
              }
            }
          })
        }
      };
    };
  },

  signupWithEmail(value, type) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/users', {
            method: 'POST',
            body: {
              user: {
                ...value,
                'account_type': type
              }
            }
          })
        }
      };
    };
  },

  loginWithEmailBase(value, type) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/sessions', {
            method: 'POST',
            body: {
              session: {
                ...value
              }
            }
          })
        }
      };
    };
  },

  loginWithEmail(value, type) {
    return ({services: {fetch}, dispatch, getState}) => {
      return {
        type: registrationTypes.LOGIN_FULL,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: dispatch(registrationActions.loginWithEmailBase(value, type))
            .then(throwOnFail)
            .then(() => dispatch(registrationActions.hydrateUserEducation()))
            .then(throwOnFail)
            .then(() => getState().user.data)
        }
      };
    };
  },


  logout() {
    return ({services: {fetch}, getState}) => {
      fetch.fetch(`/sessions/${getState().user.data.get('auth_token')}`, {method: 'DELETE'})
        .catch(e => console.log(e));

      return {
        type: registrationTypes.LOGOUT
      };
    };
  },

  destroy() {
    return ({services: {fetch}, getState}) => {
      fetch.fetch(`/users/${getState().user.data.get('id')}`, {method: 'DELETE'})
        .catch(e => console.log(e));

      return {
        type: registrationTypes.LOGOUT
      };
    };
  },

  editUser(values) {
    return ({services: {fetch}, getState}) => {
      return {
        type: registrationTypes.EDIT_USER,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}`, {
            method: 'PATCH',
            body: {
              user: values
            }
          })
        }
      };
    };
  }
};
