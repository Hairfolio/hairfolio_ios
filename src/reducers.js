import {combineReducers} from 'redux';

// Reducers
import app from './reducers/app';
import registration from './reducers/registration';

const rootReducer = combineReducers({
  app,
  registration
});

export default rootReducer;
