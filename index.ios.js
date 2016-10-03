// Register app
import {AppRegistry} from 'react-native';
import Root from './src';

import Player from './src/Player.js';

let debug = false;

if (debug) {
  AppRegistry.registerComponent('hairfolio', () => Player);
} else {
  AppRegistry.registerComponent('hairfolio', () => Root);
}
