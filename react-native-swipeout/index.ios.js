import { AppRegistry } from 'react-native';

import App from './src/App';

console.ignoredYellowBox = ["Setting a timer"]
console.ignoredYellowBox = ["BackAndroid is deprecated"]

console.disableYellowBox = true

AppRegistry.registerComponent('Hairfolio', () => App);
