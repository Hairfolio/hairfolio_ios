import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

class StarGiver {
  @observable profilePicture;
  @observable name;
  @observable isFollowing;
  @observable followLoading;

  constructor() {
    this.key = v4();
  }

  @action follow() {
    this.followLoading = true;
    setTimeout(() => {this.followLoading = false; this.isFollowing = true}, 2000);
  }

  @action unfollow() {
    this.followLoading = true;
    setTimeout(() => {this.followLoading = false; this.isFollowing = false}, 2000);
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
    let user = new StarGiver();
    user.sample('Sample User1', false);
    this.starGivers.push(user);

    user = new StarGiver();
    user.sample('Sample User1', true);
    this.starGivers.push(user);

    user = new StarGiver();
    user.sample('Sample User3', false);
    this.starGivers.push(user);
  }

  @computed get isEmpty() {
    return this.starGivers.length == 0;
  }

}

const store = new StarGiversStore();

export default store;

