import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from './Picture';
import ServiceBackend from '../../backend/ServiceBackend';

import {_, v4, moment, React, Text} from 'Hairfolio/src/helpers';

import User from './User';
import UserStore from './UserStore';
import FeedStore from './FeedStore';

export default class FollowUser {
  @observable user;
  @observable isFollowing;
  @observable followLoading;

  constructor() {
    this.key = v4();
  }

  async init(data) {
    this.user = new User();
    this.isFollowing = data.is_followed_by_me;
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
    let myId = UserStore.user.id;
    return this.user.id != myId;
  }

  async follow() {
    this.followLoading = true;

    let myId = UserStore.user.data.id;


    let res = await ServiceBackend.post(`users/${this.user.id}/follows`, { });

    this.followLoading = false;
    this.isFollowing = true;
    FeedStore.load();
  }

  async unfollow() {
    this.followLoading = true;

    let myId = UserStore.user.data.id;

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
