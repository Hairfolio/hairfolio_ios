import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from './Picture';
import ServiceBackend from '../../backend/ServiceBackend';

import {_, v4, moment, React, Text} from 'Hairfolio/src/helpers';

import User from './User';

import FollowUser from './FollowUser';


class StarGiversStore {
  @observable users = [];
  @observable isLoading = false;

  constructor() {
  }

  async load(postId) {
    this.isLoading = true;
    let users = (await ServiceBackend.get(`posts/${postId}/likes`)).likes;
    let userList = users.map(e => {
      let user = new FollowUser();
      return user.init(e.user);
    });

    this.users = await Promise.all(userList);

    this.isLoading = false;

  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }
}

const store = new StarGiversStore();

export default store;
