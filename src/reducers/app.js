import {Record} from 'immutable';
import {appTypes} from '../actions/app';

const initialState = new (Record({
  version: null,
  host: null
}));
const revive = state => initialState.merge(state);

export default function intlReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      const {app} = action.payload;
      return app ? revive(app) : initialState;
    }

  }

  return state;
}
