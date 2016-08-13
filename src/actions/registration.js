/**
 * Actions
 */

import Enum from '../lib/enum';

export const registrationTypes = new Enum(
  'SET_METHOD'
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
  }
};
