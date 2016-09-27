import {combineReducers} from 'redux';

// Reducers
import app from './reducers/app';
import registration from './reducers/registration';
import environment from './reducers/environment';
import user from './reducers/user';
import post from './reducers/post';
import users from './reducers/users';
import cloudinary from './reducers/cloudinary';

const rootReducer = combineReducers({
  app,
  registration,
  environment,
  user,
  cloudinary,
  users,
  post
});

export default rootReducer;
