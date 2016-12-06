import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';


class NewMessageStore {

  @observable newMessageNumber = 0;

  constructor() {

  }

  async load() {
    // TODO backend integration
    this.newMessageNumber = 1;
  }

}

const store = new NewMessageStore();

export default store;

