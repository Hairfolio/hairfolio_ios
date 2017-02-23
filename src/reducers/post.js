import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {postTypes} from '../actions/post';

import {LOADING, LOADING_ERROR, READY, POST_INPUT_MODE} from '../constants';

const initialState = new (Record({
  inputMethod: POST_INPUT_MODE.PHOTO
}));

export default function postReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      return initialState;
    }

    case postTypes.CHANGE_INPUT_MODE: {
      return state.merge({
        inputMethod: action.payload
      });
    }
  }

  return state;
}
