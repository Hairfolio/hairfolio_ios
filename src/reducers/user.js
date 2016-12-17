import {Record, Map, List} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';
import {educationTypes} from '../actions/education';
import {offeringsTypes} from '../actions/offerings';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  data: new Map({
    education: new List([]),
    offerings: new List([])
  }),
  followingStates: new Map({})
}));

const revive = user => initialState.mergeDeep({
  ...user,
  state: user.state === READY ? READY : EMPTY,
  followingStates: new Map({})
});

export default function userReducer(state = initialState, action) {
  var education, offerings;

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

    case registrationTypes.FOLLOW_USER_PENDING.toString(): {
      return state.setIn(['followingStates', action.payload.id], LOADING);
    }
    case registrationTypes.FOLLOW_USER_SUCCESS.toString(): {
      return state
        .setIn(['followingStates', action.payload.id], READY)
        .setIn(['data', 'follow_count'], action.payload.follow_count)
        .setIn(['data', 'following'], state.data.get('following').push(new Map({id: action.payload.id})));
    }
    case registrationTypes.FOLLOW_USER_ERROR.toString(): {
      return state.setIn(['followingStates', action.payload.id], LOADING_ERROR);
    }

    case registrationTypes.UNFOLLOW_USER_PENDING.toString(): {
      return state.setIn(['followingStates', action.payload.id], LOADING);
    }
    case registrationTypes.UNFOLLOW_USER_SUCCESS.toString(): {
      return state
        .setIn(['followingStates', action.payload.id], READY)
        .setIn(['data', 'follow_count'], action.payload.follow_count)
        .setIn(['data', 'following'], state.data.get('following').filter(f => f.get('id') !== action.payload.id));
    }
    case registrationTypes.UNFOLLOW_USER_ERROR.toString(): {
      return state.setIn(['followingStates', action.payload.id], LOADING_ERROR);
    }

    // DONE
    case registrationTypes.LOGIN_SUCCESS.toString(): {
      return state.mergeDeep({
        data: Object.assign({}, {education: [], offerings: [], following: []}, action.payload.user)
      });
    }

    case educationTypes.ADD_EDUCATION_SUCCESS.toString(): {
      return state.setIn(['data', 'education'], state.get('data').get('education').push((new Map({})).mergeDeep(action.payload)));
    }

    case educationTypes.EDIT_EDUCATION_SUCCESS.toString(): {
      education = state.get('data').get('education');
      education = education.map(step => {
        if (step.get('id') !== action.payload.id)
          return step;
        return (new Map({})).mergeDeep(action.payload);
      });
      return state.setIn(['data', 'education'], education);
    }

    case educationTypes.DELETE_EDUCATION_SUCCESS.toString(): {
      console.log('id: ', action.payload.id);
      education = state.get('data').get('education');
      education = education.filter(step => {
        return step.get('education').get('id') !== action.payload.id;
      });
      return state.setIn(['data', 'education'], education);
    }

    case offeringsTypes.ADD_OFFERINGS_SUCCESS.toString(): {
      return state.setIn(['data', 'offerings'], state.get('data').get('offerings').push((new Map({})).mergeDeep(action.payload)));
    }

    case offeringsTypes.EDIT_OFFERINGS_SUCCESS.toString(): {
      offerings = state.get('data').get('offerings');
      offerings = offerings.map(offering => {
        if (offering.get('id') !== action.payload.id)
          return offering;
        return (new Map({})).mergeDeep(action.payload);
      });
      return state.setIn(['data', 'offerings'], offerings);
    }

    case offeringsTypes.DELETE_OFFERINGS_SUCCESS.toString(): {
      offerings = state.get('data').get('offerings');
      offerings = offerings.filter(offering => {
        return offering.get('offering').get('id') !== action.payload.id;
      });
      return state.setIn(['data', 'offerings'], offerings);
    }

    case registrationTypes.HYDRATE_USER_EDUCATION_SUCCESS.toString(): {
      return state.mergeDeep({
        data: {education: action.payload}
      });
    }

    case registrationTypes.HYDRATE_USER_OFFERINGS_SUCCESS.toString(): {
      return state.mergeDeep({
        data: {offerings: action.payload}
      });
    }

    case registrationTypes.HYDRATE_USER_FOLLOWING_SUCCESS.toString(): {
      return state.mergeDeep({
        data: {following: action.payload}
      });
    }

    case registrationTypes.EDIT_USER_SUCCESS.toString(): {

      return state
        .setIn(['data', 'certificates'], new List([]))
        .setIn(['data', 'experiences'], new List([]))
        .mergeDeep({
          'data': action.payload
        });
    }

    case registrationTypes.LOGOUT: {
      return initialState;
    }

  }

  return state;
}
