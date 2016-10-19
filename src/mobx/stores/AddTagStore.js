import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, Alert} from 'hairfolio/src/helpers';

class TagItem {
  @observable name = '';

  constructor(obj) {
    this.key = v4();
    this.name = `#${obj.name}`;
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

  async search() {
    let term = this.searchTerm;
    this.isLoading = true;

    try {

      if (term.length > 0 && term[0] == '#') {
        term = term.substring(1);
      }

      let results = await ServiceBackend.getHashTags(term);
      console.log('searchresults', results);

      results = results.filter(({name}) => name != term);

      results.unshift({name: term});

      this.items = results.map(n => new TagItem(n));

    } catch(error) {
      Alert.alert('Query failed', 'The query failed, please check your internet conection and try again');
    } finally {
      this.isLoading = false;
    }
  }
}

const store = new AddTagStore();

export default store;
