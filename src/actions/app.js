/**
 * Actions
 */

import Enum from '../lib/enum';

export const appTypes = new Enum(
  'REVIVE_STATE'
);

/**
 * Action creators
 */

export const appActions = {
  reviveState(initialState = {}) {
    return {
      type: appTypes.REVIVE_STATE,
      payload: initialState
    };
  }
};
