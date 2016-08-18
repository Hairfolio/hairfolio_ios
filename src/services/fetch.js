import utils from '../utils';

export class FetchError {
  constructor(message) {
    this.name = 'FetchError';
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

function checkStatus(response) {
  var error;

  if (response.status >= 200 && response.status < 300)
    return response;
  else {
    error = new FetchError(response.statusText);
    error.response = response;
    error.jsonData = response.jsonData;
    throw error;
  }
}

export default class Fetch {
  setStore(store) {
    this.store = store;
  }

  ready() {}

  fetch(path, opts = {}) {

    opts.headers = Object.assign({}, opts.headers || {}, {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    });

    var token = '';
    if (utils.isReady(this.store.getState().user.state))
      token = this.store.getState().user.data.token;

    if (token)
      opts.headers.Authorization = token;

    if (opts.body) {
      opts.body = JSON.parse(JSON.stringify(opts.body));
      var body = {};
      Object.keys(opts.body).forEach(key => {
        if (opts.body[key] !== null)
          body[key] = opts.body[key];
      });
      opts.body = JSON.stringify(body);
    }

    var uri = this.store.getState().app.host + path;

    console.log(uri, opts);

    return window.fetch(uri, opts)
      .then((response) => {
        if (response.json)
          return response.json().then((json) => {
            response.jsonData = json;
            return response;
          });
        return response;
      })
      .then(checkStatus)
      .then((response) => {
        console.log('result received for ', uri, response.jsonData);
        return response.jsonData;
      })
      .catch((e) => {
        console.log('error received for', uri, e);
        throw e;
      });
  }
}
