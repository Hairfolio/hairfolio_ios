import Backend from './Backend.js'
const BASE_URL = 'http://hairfolio.herokuapp.com/';

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

  async postPost(data) {
    console.log('postPost', data);
    return await this.post('posts', data);
  }
}

const serviceBackend = new ServiceBackend()
export default serviceBackend
