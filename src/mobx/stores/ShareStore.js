import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

import User from 'stores/User.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

class Hairfolio {
  @observable name;
  @observable isSelected;
  @observable isInEdit;

  constructor(name, isInEdit = false) {
    this.key = v4();
    this.name = name;
    this.isSelected = false;
    this.isInEdit = isInEdit;
  }
}


class SelectableUser {
  @observable user;
  @observable isSelected;

  constructor(obj) {
    this.key = v4();
  }


  background() {
    return '#F8F8F8';
  }


  flip() {
    this.isSelected = !this.isSelected;
  }


  sample(name) {
    let user = new User();
    user.sample(name);
    this.user = user;
    this.isSelected = false;
  }
}


class SendStore {
  @observable users = [];
  @observable inputText = '';
  @observable isLoading = false;

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

  constructor() {
    this.load();
  }
  async load() {
    this.isLoading = true;
    this.inputText = '';
    this.users = [];

    let arr = [];

    for (let name of ['Albert Williams', 'Emily Tailor', 'Jack Daniels', 'Norbert King']) {
      let user = new SelectableUser();
      user.sample(name);
      arr.push(user);
    }

    this.users = arr;
    this.isLoading = false;
  }
}


class ShareStore {

  @observable hairfolios = [];
  @observable contacts = [];
  @observable sendStore = new SendStore();

  @computed get blackBookHeader() {
    return `${this.contacts.length} People`;
  }

  newHairfolio() {
    this.hairfolios.push(
      new Hairfolio(
        '',
        true
      )
    );

    setTimeout(() => this.input.focus(), 100);
  }

  saveHairfolio(store) {
    // TOOD backend
    store.isInEdit = false;
  }

  constructor() {

    this.hairfolios = [
      new Hairfolio('Inspiration'),
      new Hairfolio('My work'),
    ];

  }

  async load() {
  }

}

const store = new ShareStore();

export default store;

