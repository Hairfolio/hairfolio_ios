import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from './FilterStore';
import UserStore from './UserStore';
import Picture from './Picture';
import Service from 'Hairfolio/src/services/index';

import ServiceBackend from '../../backend/ServiceBackend';

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

