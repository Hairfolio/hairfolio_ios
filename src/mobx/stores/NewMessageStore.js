import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'
import Service from 'hairfolio/src/services/index.js'

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
    let userId = Service.fetch.store.getState().user.data.get('id');

    let res = (await ServiceBackend.get(`users/${userId}`)).user;

    this.newMessageNumber = res.unread_messages_count;
  }

}

const store = new NewMessageStore();

export default store;

