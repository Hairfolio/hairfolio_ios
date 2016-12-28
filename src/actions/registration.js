/**
 * Actions
 */

import Enum from '../lib/enum';
import utils from '../utils';
import _ from 'lodash';
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
  'HYDRATE_USER_OFFERINGS',
  'HYDRATE_USER_OFFERINGS_PENDING',
  'HYDRATE_USER_OFFERINGS_SUCCESS',
  'HYDRATE_USER_OFFERINGS_ERROR',
  'HYDRATE_USER_FOLLOWING',
  'HYDRATE_USER_FOLLOWING_PENDING',
  'HYDRATE_USER_FOLLOWING_SUCCESS',
  'HYDRATE_USER_FOLLOWING_ERROR',
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
  'CHANGE_PASSWORD',
  'CHANGE_PASSWORD_PENDING',
  'CHANGE_PASSWORD_SUCCESS',
  'CHANGE_PASSWORD_ERROR',
  'EDIT_USER',
  'EDIT_USER_PENDING',
  'EDIT_USER_SUCCESS',
  'EDIT_USER_ERROR',

  'FOLLOW_USER',
  'FOLLOW_USER_PENDING',
  'FOLLOW_USER_SUCCESS',
  'FOLLOW_USER_ERROR',

  'UNFOLLOW_USER',
  'UNFOLLOW_USER_PENDING',
  'UNFOLLOW_USER_SUCCESS',
  'UNFOLLOW_USER_ERROR',

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

  hydrateUserOfferings() {
    return ({services: {fetch}, getState}) =>
      ({
        type: registrationTypes.HYDRATE_USER_OFFERINGS,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/offerings`)
        }
      });
  },

  hydrateUserFollowing() {
    return ({services: {fetch}, getState}) =>
      ({
        type: registrationTypes.HYDRATE_USER_FOLLOWING,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/follows`)
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
          promise: fetch.fetch('/certificates')
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
          promise: fetch.fetch('/experiences')
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
          promise: fetch.fetch('/sessions/recover', {
            method: 'POST',
            body: {email}
          })
        }
      };
    };
  },

  changePassword(value) {
    return ({services: {fetch}, getState}) => {
      return {
        type: registrationTypes.CHANGE_PASSWORD,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/change_password`, {
            method: 'POST',
            body: {
              user: value
            }
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
            .then(() => Promise.all([
              dispatch(registrationActions.hydrateUserEducation()).then(throwOnFail),
              dispatch(registrationActions.hydrateUserOfferings()).then(throwOnFail),
              dispatch(registrationActions.hydrateUserFollowing()).then(throwOnFail)
            ]))
            .then(() => getState().user.data)
        }
      };
    };
  },

  signupWithFacebookBase(token, type) {
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
              'facebook_token': token,
              /*
              user: {
                'account_type': type
              }
              */
            }
          })
        }
      };
    };
  },

  signupWithFacebook(token, type) {
    return ({services: {fetch}, dispatch, getState}) => {
      return {
        type: registrationTypes.LOGIN_FULL,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: dispatch(registrationActions.signupWithFacebookBase(token, type))
          .then(throwOnFail)
          .then(() => getState().user.data)
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
              'instagram_token': token
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
            .then(() => Promise.all([
              dispatch(registrationActions.hydrateUserEducation()).then(throwOnFail),
              dispatch(registrationActions.hydrateUserOfferings()).then(throwOnFail),
              dispatch(registrationActions.hydrateUserFollowing()).then(throwOnFail)
            ]))
            .then(() => getState().user.data)
        }
      };
    };
  },

  signupWithInstagramBase(token, type) {
    return ({services: {fetch}}) => {
      return {
        type: registrationTypes.LOGIN,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/session/instagram', {
            method: 'POST',
            body: {
              'instagram_token': token,
              user: {
                'account_type': type
              }
            }
          })
        }
      };
    };
  },

  signupWithInstagram(token, type) {
    return ({services: {fetch}, dispatch, getState}) => {
      return {
        type: registrationTypes.LOGIN_FULL,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: dispatch(registrationActions.signupWithInstagramBase(token, type))
            .then(throwOnFail)
            .then(() => getState().user.data)
        }
      };
    };
  },

  signupWithEmailBase(value = {}, type) {
    return ({services: {fetch}}) => {


      console.log('email signup value', value);
      if (value.business) {
        _.each(value.business, (v, key) => value[`business_${key}`] = v);
        delete value.business;
      }

      if (type == 'brand') {
        let name = value['business_name'];
        delete value.business_name;
        value.brand_attributes = {
          name: name
        };

        type = 'ambassador'
      } else if (type == 'salon') {
        let name = value['business_name'];
        delete value.business_name;
        value.salon_attributes = {
          name: name
        };

        type = 'owner'
      }

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

  signupWithEmail(value, type) {
    return ({services: {fetch}, dispatch, getState}) => {
      return {
        type: registrationTypes.LOGIN_FULL,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: dispatch(registrationActions.signupWithEmailBase(value, type))
            .then(throwOnFail)
            .then(() => getState().user.data)
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
            .then(() => Promise.all([
              dispatch(registrationActions.hydrateUserEducation()).then(throwOnFail),
              dispatch(registrationActions.hydrateUserOfferings()).then(throwOnFail),
              dispatch(registrationActions.hydrateUserFollowing()).then(throwOnFail)
            ]))
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

  editUser(values = {}, type) {
    return ({services: {fetch}, getState}) => {

      console.log('edit user', values, type);

      if (values.experience_ids) {
        values.experience_ids = values.experience_ids.split(',').map(e => Math.floor(e));
      } else {
        values.experience_ids = [];
      }

      console.log('ex ids', values.experience_ids);

      if (values.certificate_ids) {
        values.certificate_ids = values.certificate_ids.split(',').map(e => Math.floor(e));
      } else {
        values.certificate_ids = [];
      }


      if (values.business) {

        if (type == 'ambassador') {
          let brand = {};
          _.each(values.business, (v, key) => brand[`${key}`] = v);
          delete values.business;
          values.brand_attributes = brand;

          // delete brand  attributes if they don't have a value
          if (values.brand_attributes && (!values.brand_attributes.name || values.brand_attributes.name == '')) {
            delete values.brand_attributes;
          }
        } else {
          let salon = {};
          _.each(values.business, (v, key) => salon[`${key}`] = v);
          delete values.business;
          values.salon_attributes = salon;

          // delete salon attributes if they don't have a value
          if (values.salon_attributes && (!values.salon_attributes.name || values.salon_attributes.name == '')) {
            delete values.salon_attributes;
          }
        }
      }

      values['salon_user_id'] = values['business_salon_user_id'];
      delete values['business_salon_user_id'];

      if (values['salon_user_id'] === -1)
        values['salon_user_id'] = null;

      var promise;
      if (_.isEmpty(values))
        promise = Promise.resolve(getState(getState().user.data.toJS()));
      else {
        var user = values;

        var body = _.pick(values, ['experience_ids', 'certificate_ids']);

        if (!_.isEmpty(user))
          body.user = user;

        promise = fetch.fetch(`/users/${getState().user.data.get('id')}`, {
          method: 'PATCH',
          body
        });
      }

      return {
        type: registrationTypes.EDIT_USER,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise
        }
      };
    };
  },

  followUser(id) {
    return ({services: {fetch}, getState}) => {
      return {
        type: registrationTypes.FOLLOW_USER,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${id}/follows`, {
            method: 'POST',
            body: {
              user: {id}
            }
          }).then(({followers_count}) => ({id, followers_count}), (e) => {
            e.id = id;
            throw e;
          }),
          data: {id}
        }
      };
    };
  },

  unfollowUser(id) {
    return ({services: {fetch}, getState}) => {
      return {
        type: registrationTypes.UNFOLLOW_USER,
        meta: {
          immediate: true,
          immediateAsyncResult: true,
          userId: id
        },
        payload: {
          promise: fetch.fetch(`/users/${id}/follows`, {
            method: 'DELETE'
          }),
          /* .then(({followers_count}) => ({id, followers_count}), (e) => {
            e.id = id;
            throw e;
          })*/
          data: {id}
        }
      };
    };
  }
};
