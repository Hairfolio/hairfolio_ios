import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'
import Service from 'hairfolio/src/services/index.js'

import User from 'stores/User.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import {SelectableUser as SelectableUserBase} from 'stores/WriteMessageStore.js'

class Hairfolio {
  @observable name;
  @observable isSelected;
  @observable isInEdit;

  constructor(obj, isInEdit = false) {
    this.key = v4();
    this.name = obj.name;
    this.isSelected = false;
    this.isInEdit = isInEdit;
    if (obj.id) {
      this.id = obj.id;
    }
  }
}

class SelectableUser extends SelectableUserBase {
  background() {
    return '#F8F8F8';
  }
}


class SendStore {
  @observable users = [];
  @observable inputText = '';
  @observable isLoading = false;

  @computed get selectedItems() {
    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    return users;
  }

  @computed get items() {
    if (this.inputText.length == 0) {
      return this.users;
    }

    let users = [];
    for (let u of this.users) {
      if (u.isSelected) {
        users.push(u);
      }
    }

    for (let u of this.users) {
      if (!u.isSelected && u.user.name.indexOf(this.inputText) > -1) {
        users.push(u);
      }

    }

    return users;
  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }

  get noElementsText() {
    return 'There have been no people yet.'
  }

  async load() {
    this.isLoading = false;



    this.isLoading = true;
    this.inputText = '';
    this.users = [];

    let userId = Service.fetch.store.getState().user.data.get('id')

    let res = (await ServiceBackend.get(`users/${userId}/follows?friends=true`)).users;

    let myUsers = await Promise.all(res.map(e => {
      let u = new SelectableUser();
      return u.init(e);
    }));

    this.users = myUsers;

    this.isLoading = false;
  }
}


class HairfolioStore {
  @observable isLoading = false;
  @observable hairfolios = [];

  constructor() {
  }

  async saveHairfolio(store) {
    let res = await ServiceBackend.post('folios', {folio: {name: store.name}});

    console.log('set id', res.folio.id);
    store.id = res.folio.id;
  }

  async load() {
    this.isLoading = true;

    let results = await ServiceBackend.get('folios');
    results = results.folios;

    console.log('folios', results);

    if (results.length == 0) {
      // add inspiration
      console.log('case 1');
      let res = await ServiceBackend.post('folios', {folio: {name: 'Inspiration'}});
      this.hairfolios.push(new Hairfolio(res.folio));
    } else {
      console.log('case 2');
      this.hairfolios = results.map(e => new Hairfolio(e)).reverse();
    }

    this.isLoading = false;
  }

}


class ShareStore {

  @observable contacts = [];
  @observable sendStore = new SendStore();
  @observable hairfolioStore = new HairfolioStore();

  constructor() {
    this.contacts = [];
    this.sendStore = new SendStore();
    this.hairfolioStore = new HairfolioStore();
  }


  @computed get blackBookHeader() {
    return `${this.contacts.length} People`;
  }

  reset() {
    this.contacts = [];
    this.sendStore = new SendStore();
    this.hairfolioStore = new HairfolioStore();
    this.hairfolioStore.load();
    this.sendStore.load();
  }

  newHairfolio() {
    this.hairfolioStore.hairfolios.push(
      new Hairfolio(
        '',
        true
      )
    );

    setTimeout(() => this.input.focus(), 100);
  }

  saveHairfolio(store) {
    this.hairfolioStore.saveHairfolio(store);
    store.isInEdit = false;
  }

  @computed get selectedHairfolios() {
    return this.hairfolioStore.hairfolios.filter(e => e.isSelected);
  }

  @computed get selectedUsers() {
    return this.sendStore.selectedItems;
  }
}

const store = new ShareStore();

window.shareStore = store;

export default store;

