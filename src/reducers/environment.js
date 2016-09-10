import {Record, Map, List} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';
import {educationTypes} from '../actions/education';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  degreesState: EMPTY,
  certificatesState: EMPTY,
  experiencesState: EMPTY,
  environment: new Map({}),
  degrees: new List([]),
  certificates: new List([]),
  experiences: new List([])
}));

const revive = environment => initialState.merge({
  ...environment,
  state: environment.state === READY ? READY : EMPTY,
  degreesState: environment.degreesState === READY ? READY : EMPTY,
  certificatesState: environment.certificatesState === READY ? READY : EMPTY,
  experiencesState: environment.experiencesState === READY ? READY : EMPTY
});

export default function registrationReducer(state = initialState, action) {

  switch (action.type) {
    case appTypes.REVIVE_STATE: {
      const {environment} = action.payload;
      return environment ? revive(environment) : initialState;
    }

    case registrationTypes.GET_ENVIRONMENT_PENDING.toString(): {
      return state.set('state', LOADING);
    }

    case registrationTypes.GET_ENVIRONMENT_SUCCESS.toString(): {
      return state.merge({
        state: READY,
        environment: action.payload
      });
    }

    case registrationTypes.GET_ENVIRONMENT_ERROR.toString(): {
      return state.merge({
        state: LOADING_ERROR
      });
    }

    case educationTypes.GET_DEGREES_PENDING.toString(): {
      return state.set('degreesState', LOADING);
    }

    case educationTypes.GET_DEGREES_SUCCESS.toString(): {
      return state.mergeDeep({
        degreesState: READY,
        degrees: action.payload
      });
    }

    case educationTypes.GET_DEGREES_ERROR.toString(): {
      return state.merge({
        degreesState: LOADING_ERROR
      });
    }

    case registrationTypes.GET_CERTIFICATES_PENDING.toString(): {
      return state.set('certificatesState', LOADING);
    }

    case registrationTypes.GET_CERTIFICATES_SUCCESS.toString(): {
      return state.mergeDeep({
        certificatesState: READY,
        certificates: action.payload
      });
    }

    case registrationTypes.GET_CERTIFICATES_ERROR.toString(): {
      return state.merge({
        certificatesState: LOADING_ERROR
      });
    }

    case registrationTypes.GET_EXPERIENCES_PENDING.toString(): {
      return state.set('experiencesState', LOADING);
    }

    case registrationTypes.GET_EXPERIENCES_SUCCESS.toString(): {
      return state.mergeDeep({
        experiencesState: READY,
        experiences: action.payload
      });
    }

    case registrationTypes.GET_EXPERIENCES_ERROR.toString(): {
      return state.merge({
        experiencesState: LOADING_ERROR
      });
    }

  }

  return state;
}
