// Register app
import {AppRegistry} from 'react-native';
import Root from './src';

import Player from './src/Player';

let debug = false;

if (debug) {
  AppRegistry.registerComponent('Hairfolio', () => Player);
} else {
  AppRegistry.registerComponent('Hairfolio', () => Root);
}
