const BASE_URL = 'http://hairfolio.herokuapp.com/';

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

    if (!token) {
      token = Service.fetch.store.getState().user.data.get('auth_token')
    }

    if (token) {
      headers.Authorization = token;
    }


    console.log('token', token);

    return headers;
  }


  async post(url, data) {
    console.log('post1');
    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });

    console.log('headers', this.getHeaders());

    console.log('post2', response);
    let json = await response.json();

    if (response.status) {
      json.status = response.status;
    }

    console.log('post3');
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




    let response = await myfetch(BASE_URL + url, {
      method: 'GET',
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: this.getHeaders()
    });
    let json = await response.json();
    return json;
  }
}
