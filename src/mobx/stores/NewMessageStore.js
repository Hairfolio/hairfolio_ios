import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import UserStore from './UserStore';
import Picture from 'stores/Picture.js'
import Service from 'Hairfolio/src/services/index.js'

import ServiceBackend from 'backend/ServiceBackend.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';


class NewMessageStore {

  @observable newMessageNumber = 0;

  constructor() {

  }

  async load() {
    // TODO backend integration
    let userId = UserStore.user.id;

    let res = (await ServiceBackend.get(`users/${userId}`)).user;

    this.newMessageNumber = res.unread_messages_count;
  }

}

const store = new NewMessageStore();

export default store;

