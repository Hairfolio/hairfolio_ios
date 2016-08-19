import {Record, Map} from 'immutable';
import {appTypes} from '../actions/app';
import {cloudinaryTypes} from '../actions/cloudinary';

import {LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  states: new Map({})
}));

export default function cloudinaryReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      return initialState;
    }

    case cloudinaryTypes.UPLOAD_PICTURE_PENDING.toString(): {
      return state.setIn(['states', action.payload.handle], LOADING);
    }

    case cloudinaryTypes.UPLOAD_PICTURE_SUCCESS.toString(): {
      return state.setIn(['states', action.payload.handle], LOADING_ERROR);
    }

    case cloudinaryTypes.UPLOAD_PICTURE_ERROR.toString(): {
      return state.setIn(['states', action.payload.handle], READY);
    }

  }

  return state;
}
