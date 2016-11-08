import {observable, computed, action} from 'mobx';
import {_, v4, Text} from 'hairfolio/src/helpers';

import ServiceBackend from 'backend/ServiceBackend.js'

class EnvironmentStore {
  async get() {
    if (this.environment) {
      return this.environment;
    } else {
      let res = await ServiceBackend.get('/sessions/environment');
      console.log('envi', res);
      this.environment = res;
      return res;
    }
  }
}

const store = new EnvironmentStore();

export default store;
