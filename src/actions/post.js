/**
 * Actions
 */

import {ImageEditor} from 'react-native';

import utils from '../utils';
import Enum from '../lib/enum';

export const postTypes = new Enum(
  'CHANGE_INPUT_MODE'
);

export const postActions = {
  changeInputMode(value) {
    return {
      type: postTypes.CHANGE_INPUT_MODE,
      payload: value
    };
  }
};
