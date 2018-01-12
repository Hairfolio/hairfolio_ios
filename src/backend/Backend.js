const BASE_URL = 'http://api.hairfolio.tech/';

import UserStore from '../mobx/stores/UserStore';

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

    let token2 = UserStore.user.auth_token;

    console.log('userToken', token);

    if (token2) {
      token = token2;
      UserStore.token = token2;
    }

    if (token) {
      headers.Authorization = token;
    }


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

    let json = await response.json();

    if (response.status) {
      json.status = response.status;
    }
    return json;
  }


  async post(url, data) {
    window.head = this.getHeaders();
    window.data = data;
    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });

    let json = await response.json();

    if (response.status) {
      json.status = response.status;
    }

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
