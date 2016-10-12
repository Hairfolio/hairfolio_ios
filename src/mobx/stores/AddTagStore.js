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
  @observable visibility = false;
  @observable isLoading = false;
  @observable persistent = true;
  @observable items = null;

  show() {
    this.searchTerm = '';
    this.visibility = true;
    this.persistent = true;
    this.items = null;
    this.isLoading = false;
  }

  search() {
    this.isLoading = true;

    setTimeout(() => {
      if (_.random(1) == 0) {
        this.items = [];
        this.items = _.times(13, n => new TagItem(`#item ${n + 1}`))
      } else {
        this.items = _.times(13, n => new TagItem(`#item ${n + 1}`))
      }
      this.isLoading = false;
    }, 1000);


  }
}


const store = new AddTagStore();


export default store;


