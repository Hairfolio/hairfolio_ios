import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

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


class ShareStore {

  @observable hairfolios = [];
  @observable contacts = [];

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

