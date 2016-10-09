import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';


import {v4} from 'uuid';

import {_} from 'hairfolio/src/helpers';

const INDEX = {
  CATALOG: 0,
  BROWSE: 1,
  MANUAL: 2
}

class CatalogItem {
  constructor(name, link) {
    this.link = link;
    this.name = name;
    this.key = v4();
  }
};

class Catalog {
  @observable searchText = '';
  @observable items = null;
  @observable isLoading = false;

  @action search() {
    this.isLoading = true;

    setTimeout(() => {
      if (_.random(1) == 0) {
        this.items = [];
      } else {
        this.items = _.times(13, n => new CatalogItem(`Item ${n + 1}`, 'http://www.google.com'))
      }
      this.isLoading = false;
    }, 1000);

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


