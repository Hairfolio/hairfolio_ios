const BASE_URL = 'http://api.hairfolio.tech/';

import UserStore from '../mobx/stores/UserStore';
import App from '../App'


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

    let token = UserStore.user.auth_token;

    if (token) {
      headers.Authorization = token;
    }


    return headers;
  }

  async put(url, data) {
    const prevToken = UserStore.token;
    console.log("prevToken ==>"+prevToken)
    window.head = this.getHeaders();
    window.data = data;
    let response = await myfetch(BASE_URL + url, {
      method: 'PUT',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });

    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }
    let json = await response.json();
    if (response.status) {
      json.status = response.status;
    }
    return json;
  }

  async post(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;
    let response = await myfetch(BASE_URL + url, {
      method: 'POST',
      headers: this.getHeaders(),
      timeout: 60000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });
    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }
    let json = await response.json();
    if (response.status) {
      json.status = response.status;
    }
    return json;
  }

  async patch(url, data) {
    const prevToken = UserStore.token;
    window.head = this.getHeaders();
    window.data = data;
    let response = await myfetch(BASE_URL + url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      body: JSON.stringify(data)
    });

    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }
    let json = await response.json();
    if (response.status) {
      json.status = response.status;
    }
    return json;
  }

  async delete(url) {
    const prevToken = UserStore.token;
    let response = await myfetch(BASE_URL + url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
    });
    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }
    return response;
  }

  async get(url) {
    const prevToken = UserStore.token;
    let queryUrl = BASE_URL + url;
    let response = await myfetch(queryUrl, {
      method: 'GET',
      timeout: 20000, // req/res timeout in ms, 0 to disable, timeout reset on redirect
      headers: this.getHeaders()
    });
    if (response.status === 401 && UserStore.token && prevToken === UserStore.token) {
      UserStore.setHasSessionExpired(true)
    }
    return await response.json();
  }
}
