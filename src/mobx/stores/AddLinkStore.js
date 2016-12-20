import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, Alert} from 'hairfolio/src/helpers';

const INDEX = {
  CATALOG: 0,
  BROWSE: 1,
  MANUAL: 2
}

class CatalogItem {
  constructor({name, tag, image_url, link_url }) {
    this.name = name;
    this.imageUrl = image_url;
    this.linkUrl = link_url;
    this.hashtag = tag;
    this.key = v4();
  }
};

class Catalog {
  @observable searchText = '';
  @observable items = null;
  @observable isLoading = false;

  async search() {
    let term = this.searchText;
    this.isLoading = true;

    try {

      let results = await ServiceBackend.getCatalogItems(term);
      console.log('searchresults', results);

      this.items = results.map(n => new CatalogItem(n));

    } catch(error) {
      Alert.alert('Query failed', 'The query failed, please check your internet conection and try again');
    } finally {
      this.isLoading = false;
    }
  }
}

class Browse {
  @observable title;
  @observable link;
}

class TextItem {
  @observable val = ''
}

class Manual {
  @observable title = new TextItem('');
  @observable link = new TextItem('');
}

class AddLinkStore {

  @observable catalog = new Catalog();
  @observable browse = new Browse();
  @observable manual = new Manual();

  @observable page= 0;

  reset() {
    this.title = '';
    this.link = '';
  }
}

const store = new AddLinkStore();

export default store;
