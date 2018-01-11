import {observable, computed, action} from 'mobx';

class AppStore {
  @observable appVersion;

  constructor() {
    this.appVersion = '0.0.1';
  }
}

export default new AppStore();
