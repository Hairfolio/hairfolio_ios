import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';


import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';

class TagItem {
  @observable name = '';

  constructor(name) {
    this.key = v4();
    this.name = name;
  }
}

class AddTagStore {
  @observable searchTerm = '';
  @observable visibility = true;
  @observable isLoading = false;
  @observable items = null;

  reset() {
    this.searchTerm = '';
    this.visibility = false;
  }

  search() {
    this.isLoading = true;

    setTimeout(() => {
      if (_.random(1) == 0) {
        this.items = [];
      } else {
        this.items = _.times(13, n => new TagItem(`#item ${n + 1}`))
      }
      this.isLoading = false;
    }, 1000);


  }
}


const store = new AddTagStore();


export default store;


