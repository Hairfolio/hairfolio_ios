import {combineReducers} from 'redux';

// Reducers
import app from './reducers/app';
import registration from './reducers/registration';
import environment from './reducers/environment';
import user from './reducers/user';

const rootReducer = combineReducers({
  app,
  registration,
  environment,
  user
});

export default rootReducer;
