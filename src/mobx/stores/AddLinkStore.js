import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';


import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';


class AddLinkStore {
  @observable title ='';
  @observable link = '';

  reset() {
    this.title = '';
    this.link = '';
  }

}


const store = new AddLinkStore();


export default store;


