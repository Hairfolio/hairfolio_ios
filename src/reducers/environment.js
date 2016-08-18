import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  environment: new Map({})
}));

export default function registrationReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      return initialState;
    }

    case registrationTypes.GET_ENVIRONMENT_PENDING.toString(): {
      return state.set('state', LOADING);
    }

    case registrationTypes.GET_ENVIRONMENT_SUCCESS.toString(): {
      return state.merge({
        state: READY,
        environment: action.payload
      });
    }

    case registrationTypes.GET_ENVIRONMENT_ERROR.toString(): {
      return state.merge({
        state: LOADING_ERROR
      });
    }

  }

  return state;
}
