import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Activity from 'stores/Activity.js'

class ActivityYouStore {
  @observable isLoading = false;
  @observable elements = [];

  constructor() {
  }

  async load() {
    this.isLoading = true;

    this.elements = [];

    let arr = (await ServiceBackend.get('notifications'));

    arr = arr.notifications;
    arr = arr.filter(e => e.notifiable_type != 'NilClass');

    let res = await Promise.all(
      arr.map(
        async e => {
          let a = new Activity();
          return await a.init(e);
        }
      )
    )

    this.elements = res;

    this.isLoading = false;
  }
}

const store = new ActivityYouStore();

export default store;

