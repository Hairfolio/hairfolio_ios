import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'
import globalStore from 'hairfolio/src/store.js';

import FeedStore from 'stores/FeedStore.js'

export default class FollowUser {
  @observable user;
  @observable isFollowing;
  @observable followLoading;

  constructor() {
    this.key = v4();
  }

  async init(data) {
    this.user = new User();
    // TODO
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

    let res = await ServiceBackend.post(`users/${this.user.id}/follows`, { });

    console.log('followResults', res);
    this.followLoading = false;
    this.isFollowing = true;
    FeedStore.load();
  }

  async unfollow() {
    this.followLoading = true;

    let myId = globalStore.getState().user.data.get('id')

    let res = await ServiceBackend.delete(`users/${this.user.id}/follows`);

    this.followLoading = false;
    this.isFollowing = false
    FeedStore.load();
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
