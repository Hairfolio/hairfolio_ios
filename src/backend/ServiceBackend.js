import Backend from './Backend.js'
const BASE_URL = 'http://hairfolio.herokuapp.com/';

import CreatePostStore from 'stores/CreatePostStore.js'
import FeedStore from 'stores/FeedStore.js'
import SearchStore from 'stores/SearchStore.js'

import * as routes from 'hairfolio/src/routes.js'

let myfetch = function(input, opts) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, opts.timeout);
    fetch(input, opts).then(resolve, reject);
  });
}


class ServiceBackend extends Backend {
  async getServices() {
    return await this.get('services');
  }

  async getBrands(serviceId) {
    return await this.get(`brands?service_id=${serviceId}`);
  }

  async getLines(brandId) {
    return await this.get(`lines?brand_id=${brandId}`);
  }

  async getColors(lineId) {
    return await this.get(`colors?line_id=${lineId}`);
  }

  async getHashTags(name) {
    return await this.get(`hashtags?name=${name}`);
  }

  async getCatalogItems(name) {
    return await this.get(`catalog_items?product_name=${name}`);
  }

  async postPost() {

    try {
      CreatePostStore.isLoading = true;

      CreatePostStore.loadingText = 'Uploading pictures ..';
      let data = await CreatePostStore.gallery.toJSON();


      CreatePostStore.loadingText = 'Publishing the post';
      let res = await this.post('posts', data);

      FeedStore.load();
      SearchStore.refresh();

      window.navigators[1].jumpTo(routes.createPost)
      window.navigators[0].jumpTo(routes.appStack);

      CreatePostStore.isLoading = false

      // only reset after view is gone
      setTimeout(() => CreatePostStore.reset(), 1000);
    } catch(err) {
      CreatePostStore.isLoading = false;
      alert('An error occured ' + err.toString());
    }
  }
}

const serviceBackend = new ServiceBackend()
export default serviceBackend
