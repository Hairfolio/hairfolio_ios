import {observable, computed, action} from 'mobx';

import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

class Contact {
  @observable name;
  @observable picture;

  @computed get startLetter() {
    return this.name.toUpperCase()[0];
  }

  constructor(obj) {
    this.name = obj.first_name + ' ' + obj.last_name;
    this.key = v4();

    if (obj.asset_url) {
      let picObj = {uri: obj.asset_url, isStatic: true};
      this.picture = new Picture(
        picObj,
        picObj,
        null
      );
    }
  }
}

class BlackBookStore {
  @observable show = false;
  @observable isLoading = false;
  @observable contacts = [];
  @observable mode = 'normal';
  @observable inputText = '';

  @action startSearchMode() {
    this.mode = 'search';
    this.inputText = '';
    setTimeout(() => store.input.focus(), 100);
  }

  @action cancelSearchMode() {
    this.mode = 'normal';
  }

  reset() {
    this.load();
  }

  constructor() {
  }

  @computed get hasData() {
    return Object.keys(this.data).length > 0;
  }

  @computed get data() {
    if (this.contacts.length == 0) {
      return {};
    } else {
      let dict = {};
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => {
        let list = this.contacts.map(e => e).filter(e => e.startLetter == c);

        if (list.length > 0) {
          list[list.length - 1].isLast = true;
          dict[c] = list;
        }
      });
      return dict;
    }
  }

  @computed get filteredContacts() {
    if (this.inputText == '') {
      return this.contacts;
    } else {
      let list = this.contacts.filter(e => e.name.indexOf(this.inputText) > -1).map(e => e);

      return list;
    }
  }

  async load() {
    this.isLoading = true;
    this.inputText = '';
    this.mode = 'normal';

    let contacts = (await ServiceBackend.get('contacts')).contacts;
    console.log('contacts', contacts);

    this.contacts = contacts.map(e => new Contact(e));

    this.isLoading = false;
  }
}

const store = new BlackBookStore();

window.blackBookStore = store;

export default store;

