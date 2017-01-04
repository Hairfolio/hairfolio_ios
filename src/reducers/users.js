import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {usersTypes} from '../actions/users';
import {registrationTypes} from '../actions/registration';

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
        .setIn(['states', action.payload.user.id], READY)
        .setIn(['users', action.payload.user.id], (new Map({})).mergeDeep(action.payload.user));
    }

    case usersTypes.GET_USER_ERROR.toString(): {
      return state.setIn(['states', action.payload.id], LOADING_ERROR);
    }

    case registrationTypes.FOLLOW_USER_SUCCESS.toString(): {
      if (!state.users.get(action.payload.id))
        return state;

      return state
        .setIn(['users', action.payload.id, 'followers_count'], state.users.get(action.payload.id).get('followers_count') + 1);
    }

    case registrationTypes.UNFOLLOW_USER_SUCCESS.toString(): {
      if (!state.users.get(action.payload.id))
        return state;

      return state
        .setIn(['users', action.payload.id, 'followers_count'], state.users.get(action.payload.id).get('followers_count') - 1);
    }

  }

  return state;
}
