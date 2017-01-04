import {Record, Map, List} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';
import {educationTypes} from '../actions/education';
import {offeringsTypes} from '../actions/offerings';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  data: new Map({
    educations: new List([]),
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
  var educations, offerings;

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

      setTimeout(() => {
        window.profileState.setState({followed: true});
      });

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
      window.state = state;
      console.log('state', state);

      setTimeout(() => {
        window.profileState.setState({followed: false});
      });

      return state
        .setIn(['followingStates', action.meta.userId], READY)
        .setIn(['data', 'follow_count'], action.payload.following)
        .setIn(['data', 'following'], state.data.get('following').filter(f => f.get('id') !== action.meta.userId));
    }
    case registrationTypes.UNFOLLOW_USER_ERROR.toString(): {
      return state.setIn(['followingStates', action.payload.id], LOADING_ERROR);
    }

    case registrationTypes.LOGIN_SUCCESS.toString(): {
      return state.mergeDeep({
        data: Object.assign({}, {educations: [], offerings: [], following: []}, action.payload.user)
      });
    }

    case educationTypes.ADD_EDUCATION_SUCCESS.toString(): {
      console.log('ADD_EDUCATION_SUCCESS', action.payload);
      return state.setIn(['data', 'educations'], state.get('data').get('educations').push((new Map({})).mergeDeep(action.payload.education)));
    }

    case educationTypes.EDIT_EDUCATION_SUCCESS.toString(): {
      console.log('EDIT_EDUCATION_SUCCESS', action.payload);
      educations = state.get('data').get('educations');
      educations = educations.map(step => {
        if (step.get('id') !== action.payload.education.id)
          return step;
        return (new Map({})).mergeDeep(action.payload.education);
      });
      return state.setIn(['data', 'educations'], educations);
    }

    case educationTypes.DELETE_EDUCATION_SUCCESS.toString(): {
      console.log('DELETE_EDUCATION_SUCCESS', action.payload);
      educations = state.get('data').get('educations');
      educations = educations.filter(step => {
        return step.get('id') !== action.payload.education.id;
      });
      return state.setIn(['data', 'educations'], educations);
    }

    case offeringsTypes.ADD_OFFERINGS_SUCCESS.toString(): {
      console.log('ADD_OFFERINGS_SUCCESS', action.payload);
      return state.setIn(['data', 'offerings'], state.get('data').get('offerings').push((new Map({})).mergeDeep(action.payload.offering)));
    }

    case offeringsTypes.EDIT_OFFERINGS_SUCCESS.toString(): {
      console.log('EDIT_OFFERINGS_SUCCESS', action.payload);
      offerings = state.get('data').get('offerings');
      offerings = offerings.map(offering => {
        if (offering.get('id') !== action.payload.offering.id)
          return offering;
        return (new Map({})).mergeDeep(action.payload.offering);
      });
      return state.setIn(['data', 'offerings'], offerings);
    }

    case offeringsTypes.DELETE_OFFERINGS_SUCCESS.toString(): {
      console.log('DELETE_OFFERINGS_SUCCESS', action.payload);
      offerings = state.get('data').get('offerings');
      offerings = offerings.filter(offering => {
        return offering.get('offering').get('id') !== action.payload.offering.id;
      });
      return state.setIn(['data', 'offerings'], offerings);
    }

    case registrationTypes.HYDRATE_USER_EDUCATION_SUCCESS.toString(): {
      return state.mergeDeep({
        data: {educations: action.educations}
      });
    }

    case registrationTypes.HYDRATE_USER_OFFERINGS_SUCCESS.toString(): {
      return state.mergeDeep({
        data: {offerings: action.offerings}
      });
    }

    case registrationTypes.HYDRATE_USER_FOLLOWING_SUCCESS.toString(): {
      return state.mergeDeep({
        data: {following: action.users}
      });
    }

    case registrationTypes.EDIT_USER_SUCCESS.toString(): {

      console.log('edit data', action);

      return state
        .setIn(['data', 'certificates'], new List([]))
        .setIn(['data', 'experiences'], new List([]))
        .mergeDeep({
          'data': action.payload.user
        });
    }

    case registrationTypes.LOGOUT: {
      return initialState;
    }

  }

  return state;
}
