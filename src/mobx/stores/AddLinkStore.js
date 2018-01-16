import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';

import ServiceBackend from '../../backend/ServiceBackend';

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


  @observable nextPage;

  async search() {
    let term = this.searchText;

    this.items = [];
    this.isLoading = true;
    this.isLoadingNextPage = false;

    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;











  }

  async loadNextPage() {
    console.log('load next page');
    if (!this.isLoadingNextPage && this.nextPage != null) {
      console.log('loadNextPage', this.nextPage);
      this.isLoadingNextPage = true;
      let res = (await ServiceBackend.get(`products?q=${this.searchText}&page=${this.nextPage}`));

      window.queryRes = res;
      console.log('query res', res);

      let {products, meta} = res;


      products = products.filter(i => i.cloudinary_url && i.cloudinary_url.length > 0);


      for (let a = 0; a < products.length; a++)  {
        let item = new CatalogItem(products[a]);
        this.items.push(item);
      }

      this.nextPage = meta.next_page
      this.isLoadingNextPage = false;
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
