import utils from '../utils';
import _ from 'lodash';

export class FetchError {
  constructor(message) {
    this.name = 'FetchError';
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300)
    return response;
  else {
    var err = response.jsonData && (response.jsonData.error || response.jsonData.errors);

    if (_.isObject(err))
      err = _.map(err, (value, key) => {
        if (_.isArray(value))
          value = value.join(', ');

        return `${key}: ${value}`;
      }).join('\n');

    err = err || 'API Error';

    throw new Error(err);
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

    var token = this.store.getState().user.data.get('auth_token');

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

    console.log('fetch', uri, opts);

    return window.fetch(uri, opts)
      .then(utils.parseJSON)
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
