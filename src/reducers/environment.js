import {Record, Map, List} from 'immutable';
import {appTypes} from '../actions/app';
import {registrationTypes} from '../actions/registration';
import {educationTypes} from '../actions/education';
import {offeringsTypes} from '../actions/offerings';

import {EMPTY, LOADING, LOADING_ERROR, READY} from '../constants';

const initialState = new (Record({
  state: EMPTY,
  degreesState: EMPTY,
  servicesState: EMPTY,
  categoriesState: EMPTY,
  certificatesState: EMPTY,
  experiencesState: EMPTY,
  environment: new Map({}),
  degrees: new List([]),
  services: new List([]),
  categories: new List([]),
  certificates: new List([]),
  experiences: new List([])
}));

const revive = environment => initialState.merge({
  ...environment,
  state: environment.state === READY ? READY : EMPTY,
  degreesState: environment.degreesState === READY ? READY : EMPTY,
  servicesState: environment.servicesState === READY ? READY : EMPTY,
  categoriesState: environment.categoriesState === READY ? READY : EMPTY,
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
      console.log('environment', action.payload);
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
      return state.set('degreesState', state.degreesState !== READY ? LOADING : READY);
    }

    case educationTypes.GET_DEGREES_SUCCESS.toString(): {
      return state.mergeDeep({
        degreesState: READY,
        degrees: action.degrees
      });
    }

    case educationTypes.GET_DEGREES_ERROR.toString(): {
      return state.merge({
        degreesState: state.degreesState !== READY ? LOADING_ERROR : READY
      });
    }

    case offeringsTypes.GET_SERVICES_PENDING.toString(): {
      return state.set('servicesState', state.servicesState !== READY ? LOADING : READY);
    }

    case offeringsTypes.GET_SERVICES_SUCCESS.toString(): {
      return state.mergeDeep({
        servicesState: READY,
        services: action.payload.services
      });
    }

    case offeringsTypes.GET_SERVICES_ERROR.toString(): {
      return state.merge({
        servicesState: state.servicesState !== READY ? LOADING_ERROR : READY
      });
    }

    case offeringsTypes.GET_CATEGORIES_PENDING.toString(): {
      return state.set('categoriesState', state.categoriesState !== READY ? LOADING : READY);
    }

    case offeringsTypes.GET_CATEGORIES_SUCCESS.toString(): {
      return state.mergeDeep({
        categoriesState: READY,
        categories: action.categories
      });
    }

    case offeringsTypes.GET_CATEGORIES_ERROR.toString(): {
      return state.merge({
        categoriesState: state.categoriesState !== READY ? LOADING_ERROR : READY
      });
    }

    case registrationTypes.GET_CERTIFICATES_PENDING.toString(): {
      return state.set('certificatesState', LOADING);
    }

    case registrationTypes.GET_CERTIFICATES_SUCCESS.toString(): {
      return state.mergeDeep({
        certificatesState: READY,
        certificates: action.certificates
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
