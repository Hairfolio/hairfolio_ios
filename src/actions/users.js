/**
 * Actions
 */

import Enum from '../lib/enum';

export const usersTypes = new Enum(
  'GET_USER',
  'GET_USER_PENDING',
  'GET_USER_SUCCESS',
  'GET_USER_ERROR'
);

/**
 * Action creators
 */

export const usersActions = {
  getUser(userId) {
    return ({services: {fetch}}) => {
      return {
        type: usersTypes.GET_USER,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: Promise
            .all([
              fetch.fetch(`/users/${userId}`),
              //fetch.fetch(`/users/${userId}/offerings`)
            ])
            .then(([user, offerings]) => ({...user, offerings}), () => {
              var data = {id: userId};
              throw data;
            }),
          data: {
            id: userId
          }
        }
      };
    };
  }
};
