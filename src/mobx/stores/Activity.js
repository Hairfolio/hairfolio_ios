import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'
import globalStore from 'hairfolio/src/store.js';

class PostInfo {
  @observable picture;

  constructor() {
  }

  sample() {
    let pic = require('img/feed_example4.png');

    this.picture = new Picture(
      pic,
      pic,
      null
    );
  }
}

export default class Activity {
  @observable user;
  @observable user2;
  @observable createdTime;
  @observable type;
  @observable post;

  constructor() {
    this.key = v4();
  }


  timeDifference() {
    return this.createdTime.toNow(true);
  }

  sample() {
    this.user = new User();
    this.user.sample();
    this.user2 = new User();
    this.user2.sample();
    this.createdTime = moment().subtract({minutes: 15});
    this.type = 'follow';
  }


  sample2() {
    this.user = new User();
    this.user.sample();
    this.createdTime = moment().subtract({minutes: 20});


    this.user2 = new User();
    this.user2.sample();

    this.type = 'star';
    this.post = new PostInfo();
    this.post.sample();
  }
}


