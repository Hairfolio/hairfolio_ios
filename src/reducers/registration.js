import {Record} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';

const initialState = new (Record({
  method: null
}));

export default function registrationReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      return initialState;
    }

    case registrationTypes.SET_METHOD: {
      return state.set('method', action.payload);
    }

  }

  return state;
}
