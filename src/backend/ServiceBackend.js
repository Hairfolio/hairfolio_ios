import Backend from './Backend.js'
const BASE_URL = 'http://hairfolio.herokuapp.com/';

import CreatePostStore from 'stores/CreatePostStore.js'

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
    CreatePostStore.isLoading = true;

    console.log('upload picture');
    let data = await CreatePostStore.gallery.toJSON();
    console.log('postPost', JSON.stringify(data));
    let res = await this.post('posts', data);
    console.log('postresponse', res);

    window.navigators[0].jumpTo(routes.appStack);

    // only reset after view is gone
    setTimeout(() => CreatePostStore.reset(), 1000);
  }
}

const serviceBackend = new ServiceBackend()
export default serviceBackend
