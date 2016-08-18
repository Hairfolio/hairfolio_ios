import {Record} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  data: new (Record({}))
}));

export default function registrationReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      return initialState;
    }

  }

  return state;
}
