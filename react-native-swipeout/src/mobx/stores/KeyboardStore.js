import { observable } from 'mobx';
import React from 'react-native';

let { DeviceEventEmitter } = React;

// class that listens to the keyboard and sets the height accordingly
class KeyboardStore {

  @observable height = 0;

  constructor() {
    DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  _keyboardWillShow(e) {
    this.height = e.endCoordinates.height;
  }

  _keyboardWillHide(e) {
    this.height = 0;
  }
}


const store = new KeyboardStore();


export default store;


