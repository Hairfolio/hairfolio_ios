import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {usersTypes} from '../actions/users';

import {LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  states: new Map({}),
  users: new Map({})
}));

export default function usersReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      return initialState;
    }

    case usersTypes.GET_USER_PENDING.toString(): {
      return state.setIn(['states', action.payload.id], LOADING);
    }

    case usersTypes.GET_USER_SUCCESS.toString(): {
      return state
        .setIn(['states', action.payload.id], READY)
        .setIn(['users', action.payload.id], (new Map({})).mergeDeep(action.payload));
    }

    case usersTypes.GET_USER_ERROR.toString(): {
      return state.setIn(['states', action.payload.id], LOADING_ERROR);
    }

  }

  return state;
}
