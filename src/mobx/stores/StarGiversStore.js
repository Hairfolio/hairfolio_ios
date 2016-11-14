import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'
import globalStore from 'hairfolio/src/store.js';

class StarGiver {
  @observable user;
  @observable isFollowing;
  @observable followLoading;

  constructor() {
    this.key = v4();
  }

  async init(data) {
    this.user = new User();
    this.isFollowing = data.followed_by_me;
    await this.user.init(data);
    return this;
  }

  @computed get profilePicture() {
    return this.user.profilePicture;
  }

  @computed get name() {
    return this.user.name;
  }

  @computed get showFollowButton() {
    let myId = globalStore.getState().user.data.get('id')
    return this.user.id != myId;
  }

  async follow() {
    this.followLoading = true;

    let myId = globalStore.getState().user.data.get('id')

    console.log('myId', myId);
    console.log('toId', this.user.id);

    let res = await ServiceBackend.post(`users/${myId}/follow`, {
      user: {
        id: this.user.id
      }
    });

    console.log('followResults', res);
    this.followLoading = false;
    this.isFollowing = true;
  }

  async unfollow() {
    this.followLoading = true;

    let myId = globalStore.getState().user.data.get('id')

    let res = await ServiceBackend.post(`users/${myId}/unfollow`, {
      user: {
        id: this.user.id
      }
    });

    this.followLoading = false;
    this.isFollowing = false
  }

  sample(name, isFollowing) {
    let picObj = require('img/feed_example_profile.png');
    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );

    this.isFollowing = isFollowing;

    this.name = name;
  }
}

class StarGiversStore {
  @observable starGivers = [];
  @observable isLoading = false;

  constructor() {
      /*
    let user = new StarGiver();
    user.sample('Sample User1', false);
    this.starGivers.push(user);

    user = new StarGiver();
    user.sample('Sample User1', true);
    this.starGivers.push(user);

    user = new StarGiver();
    user.sample('Sample User3', false);
    this.starGivers.push(user);
    */
  }

  async load(postId) {
    this.isLoading = true;
    console.log('postId');
    let users = await ServiceBackend.get(`posts/${postId}/starred`);
    console.log('users', users);
    let userList = users.map(e => {
      let user = new StarGiver();
      return user.init(e);
    });

    console.log('userList', userList);

    this.starGivers = await Promise.all(userList);

    console.log('starGivers', this.starGivers);

    this.isLoading = false;

  }

  @computed get isEmpty() {
    return this.starGivers.length == 0;
  }

}

const store = new StarGiversStore();

export default store;

