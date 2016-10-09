import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

let React = require('react-native');
let { DeviceEventEmitter } = React;


import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';

// class that listens to the keyboard and sets the height accordingly
class KeyboardStore {

  @observable keyboardHeight = 0;

  constructor() {
    DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  _keyboardWillShow(e) {
    this.keyboardHeight = e.endCoordinates.height;
  }

  _keyboardWillHide(e) {
    this.keyboardHeight = 0;
  }
}


const store = new KeyboardStore();


export default store;


