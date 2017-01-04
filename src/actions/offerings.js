/**
 * Actions
 */

import Enum from '../lib/enum';
import utils from '../utils';
import {throwOnFail} from '../lib/reduxPromiseMiddleware';

export const offeringsTypes = new Enum(
  'GET_SERVICES',
  'GET_SERVICES_PENDING',
  'GET_SERVICES_SUCCESS',
  'GET_SERVICES_ERROR',
  'GET_CATEGORIES',
  'GET_CATEGORIES_PENDING',
  'GET_CATEGORIES_SUCCESS',
  'GET_CATEGORIES_ERROR',
  'ADD_OFFERINGS',
  'ADD_OFFERINGS_PENDING',
  'ADD_OFFERINGS_SUCCESS',
  'ADD_OFFERINGS_ERROR',
  'EDIT_OFFERINGS',
  'EDIT_OFFERINGS_PENDING',
  'EDIT_OFFERINGS_SUCCESS',
  'EDIT_OFFERINGS_ERROR',
  'DELETE_OFFERINGS',
  'DELETE_OFFERINGS_PENDING',
  'DELETE_OFFERINGS_SUCCESS',
  'DELETE_OFFERINGS_ERROR'
);

/**
 * Action creators
 */

export const offeringsActions = {
  getServices() {
    return ({getState, services: {fetch}}) => {
      return {
        type: offeringsTypes.GET_SERVICES,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/services')
        }
      };
    };
  },

  getCategories() {
    return ({getState, services: {fetch}}) => {
      return {
        type: offeringsTypes.GET_CATEGORIES,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/categories')
        }
      };
    };
  },

  addOffer(offering) {
    return ({services: {fetch}, getState}) => {
      return {
        type: offeringsTypes.ADD_OFFERINGS,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/offerings`, {
            method: 'POST',
            body: {
              offering
            }
          })
        }
      };
    };
  },

  editOffer(id, offering) {
    return ({services: {fetch}, getState}) => {
      return {
        type: offeringsTypes.EDIT_OFFERINGS,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/offerings/${id}`, {
            method: 'PUT',
            body: {
              offering
            }
          })
        }
      };
    };
  },

  deleteOffer(id) {
    return ({services: {fetch}, getState}) => {
      return {
        type: offeringsTypes.DELETE_OFFERINGS,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/offerings/${id}`, {
            method: 'DELETE'
          }).then(r => ({id}))
        }
      };
    };
  }
};
