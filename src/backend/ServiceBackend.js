const BASE_URL = 'http://hairfolio.herokuapp.com/';

class ServiceBackend {

  async get(url) {

    try {
      let response = await fetch(BASE_URL + url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(url, json);
      return json;
    } catch (err) {
      console.log(url, err);
      return err;
    }
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

}

const serviceBackend = new ServiceBackend()
export default serviceBackend
