import {observable, computed, action} from 'mobx';

class AppStore {
  @observable appVersion;
  @observable host;

  constructor() {
    this.appVersion = '1.2.0';
    this.host = 'http://api.hairfolio.tech';
  }
}

export default new AppStore();
