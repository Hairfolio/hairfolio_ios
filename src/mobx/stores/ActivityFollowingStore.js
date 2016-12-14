import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Activity from 'stores/Activity.js'

class ActivityFollowingStore {
  @observable isLoading = false;
  @observable elements = [];

  constructor() {
  }

  async load() {
    this.isLoading = true;

    this.elements = [];

    let arr = await ServiceBackend.get('/activities?per_page=20');

    this.elements = await Promise.all(
      arr.map(
        async e => {
          let a = new Activity();
          await a.init(e);
          return a;
        }
      )
    )

    this.isLoading = false;
  }
}

const store = new ActivityFollowingStore();

export default store;

