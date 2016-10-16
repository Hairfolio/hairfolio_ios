const BASE_URL = 'http://hairfolio.herokuapp.com/';

let myfetch = function(input, opts) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, opts.timeout);
    fetch(input, opts).then(resolve, reject);
  });
}

// for managing the backend one needs to also catch the exceptions
class ServiceBackend {

  async get(url) {
    let response = await myfetch(BASE_URL + url, {
      method: 'GET',
      follow: 20, // maximum redirect count, 0 to not follow redirect
      timeout: 2000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    let json = await response.json();
    return json;
  }


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

}

const serviceBackend = new ServiceBackend()
export default serviceBackend
