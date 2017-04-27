import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, Alert} from 'Hairfolio/src/helpers';

const INDEX = {
  CATALOG: 0,
  BROWSE: 1,
  MANUAL: 2
}

class CatalogItem {
  constructor({name, tag, image_url, cloudinary_url, link_url }) {
    this.name = name;
    this.imageUrl = image_url;
    this.linkUrl = link_url;
    this.hashtag = tag;
    this.key = v4();

    let uri = cloudinary_url;
    if (uri && uri.indexOf('cloudinary') > -1) {
      let splitUrl = uri.split('upload');
      this.imageUrl = `${splitUrl[0]}upload/w_150${splitUrl[1]}`;
    }
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
      results = results.filter(i => i.cloudinary_url && i.cloudinary_url.length > 0);

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
