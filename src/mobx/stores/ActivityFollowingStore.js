import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';


import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Activity from 'stores/Activity.js'

class ActivityFollowingStore {
  @observable isLoading = false;
  @observable elements = [];

  constructor() {
  }

  load() {
    this.isLoading = true;

    this.elements = [];

    let a1 = new Activity();
    a1.sample();
    this.elements.push(a1);

    let a2 = new Activity();
    a2.sample2();
    this.elements.push(a2);

    this.isLoading = false;
  }
}

const store = new ActivityFollowingStore();

export default store;

