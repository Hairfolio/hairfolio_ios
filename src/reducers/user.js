import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  data: new Map({})
}));

const revive = user => initialState.merge({
  state: user.state === READY ? READY : EMPTY,
  ...user
});

export default function userReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      const {user} = action.payload;
      return user ? revive(user) : initialState;
    }

    case registrationTypes.LOGIN_PENDING.toString(): {
      return state.set('state', LOADING);
    }

    case registrationTypes.LOGIN_SUCCESS.toString(): {
      return state.merge({
        state: READY,
        data: action.payload
      });
    }

    case registrationTypes.LOGIN_ERROR.toString(): {
      return state.merge({
        state: LOADING_ERROR
      });
    }

  }

  return state;
}
