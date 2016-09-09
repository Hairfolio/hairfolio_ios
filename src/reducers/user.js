import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  data: new Map({})
}));

const revive = user => initialState.mergeDeep({
  ...user,
  state: user.state === READY ? READY : EMPTY
});

export default function userReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      const {user} = action.payload;
      return user ? revive(user) : initialState;
    }

    case registrationTypes.LOGIN_FULL_PENDING.toString(): {
      return state.set('state', LOADING);
    }
    case registrationTypes.LOGIN_FULL_SUCCESS.toString(): {
      return state.merge({
        state: READY
      });
    }
    case registrationTypes.LOGIN_FULL_ERROR.toString(): {
      return state.merge({
        state: LOADING_ERROR
      });
    }

    case registrationTypes.LOGIN_SUCCESS.toString(): {
      return state.mergeDeep({
        data: Object.assign({}, action.payload, {education: []})
      });
    }

    case registrationTypes.HYDRATE_USER_EDUCATION.toString(): {
      return state.mergeDeep({
        data: {education: action.payload}
      });
    }

    case registrationTypes.EDIT_USER_SUCCESS.toString(): {
      return state.mergeDeep({
        'data': action.payload
      });
    }

    case registrationTypes.LOGOUT: {
      return initialState;
    }

  }

  return state;
}
