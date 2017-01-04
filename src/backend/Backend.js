const BASE_URL = 'http://api.hairfolio.tech/';

import Service from 'hairfolio/src/services/index.js'
import UserStore from 'stores/UserStore.js';

let myfetch = function(input, opts) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, opts.timeout);
    fetch(input, opts).then(resolve, reject);
  });
}

export default class Backend {


  getHeaders() {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    let token = UserStore.token;

    let token2 = Service.fetch.store.getState().user.data.get('auth_token')

    if (token2) {
      token = token2;
      UserStore.token = token2;
    }

    if (token) {
      headers.Authorization = token;
    }


    console.log('token', token);

    return headers;
  }

  async put(url, data) {
    window.head = this.getHeaders();
    window.data = data;
    let response = await myfetch(BASE_URL + url, {
      method: 'PUT',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });

    console.log('response', data);

    console.log('put2', response);
    let json = await response.json();

    if (response.status) {
      json.status = response.status;
    }
    return json;
  }


  async post(url, data) {
    console.log('post ', BASE_URL + url);

    window.head = this.getHeaders();
    window.data = data;
    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });

    console.log('post2 '  + BASE_URL + url, response);
    let json = await response.json();

    if (response.status) {
      json.status = response.status;
    }

    console.log('post3 ' + BASE_URL + url, json);

    return json;
  }

  async delete(url) {
    let response = await myfetch(BASE_URL + url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
    });

    return response;
  }

  async get(url) {

    let queryUrl = BASE_URL + url;

    let response = await myfetch(queryUrl, {
      method: 'GET',
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: this.getHeaders()
    });
    let json = await response.json();
    return json;
  }
}
