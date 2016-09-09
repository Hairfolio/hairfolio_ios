/**
 * Actions
 */

import Enum from '../lib/enum';
import utils from '../utils';
import {throwOnFail} from '../lib/reduxPromiseMiddleware';

export const educationTypes = new Enum(
  'SET_METHOD',
  'GET_DEGREES',
  'GET_DEGREES_PENDING',
  'GET_DEGREES_SUCCESS',
  'GET_DEGREES_ERROR',
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
          promise: utils.isReady(getState().environment.degreesState) ?
            Promise.resolve(getState().environment.degrees.toJS())
          :
            fetch.fetch('/degrees')
        }
      };
    };
  }
};
