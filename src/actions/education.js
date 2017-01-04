/**
 * Actions
 */

import Enum from '../lib/enum';
import utils from '../utils';
import {throwOnFail} from '../lib/reduxPromiseMiddleware';

export const educationTypes = new Enum(
  'GET_DEGREES',
  'GET_DEGREES_PENDING',
  'GET_DEGREES_SUCCESS',
  'GET_DEGREES_ERROR',
  'ADD_EDUCATION',
  'ADD_EDUCATION_PENDING',
  'ADD_EDUCATION_SUCCESS',
  'ADD_EDUCATION_ERROR',
  'EDIT_EDUCATION',
  'EDIT_EDUCATION_PENDING',
  'EDIT_EDUCATION_SUCCESS',
  'EDIT_EDUCATION_ERROR',
  'DELETE_EDUCATION',
  'DELETE_EDUCATION_PENDING',
  'DELETE_EDUCATION_SUCCESS',
  'DELETE_EDUCATION_ERROR'
);

/**
 * Action creators
 */

export const educationActions = {
  getDegrees() {
    return ({getState, services: {fetch}}) => {
      return {
        type: educationTypes.GET_DEGREES,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch('/degrees')
        }
      };
    };
  },

  addEducation(education) {

    console.log('education', education);


    return ({services: {fetch}, getState}) => {
      return {
        type: educationTypes.ADD_EDUCATION,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/educations`, {
            method: 'POST',
            body: {
              education
            }
          })
        }
      };
    };
  },

  editEducation(id, education) {
    return ({services: {fetch}, getState}) => {
      return {
        type: educationTypes.EDIT_EDUCATION,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/educations/${id}`, {
            method: 'PUT',
            body: {
              education
            }
          })
        }
      };
    };
  },

  deleteEducation(id) {
    return ({services: {fetch}, getState}) => {
      return {
        type: educationTypes.DELETE_EDUCATION,
        meta: {
          immediate: true,
          immediateAsyncResult: true
        },
        payload: {
          promise: fetch.fetch(`/users/${getState().user.data.get('id')}/educations/${id}`, {
            method: 'DELETE'
          }).then(r => ({id}))
        }
      };
    };
  }
};
