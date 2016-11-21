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

  init(obj) {
    this.id = obj.id;
    let picObj =  {uri: obj.post_items[0].url};
    this.picture = new Picture(
      picObj,
      picObj,
      null
    );
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

  async init(obj) {
    this.createdTime = moment(obj.created_at);

    let user = new User();
    await user.init(obj.user);
    this.user = user;

    if (obj.activity_type == 'follow_user') {
      this.type = 'follow';

      let user2 = new User();
      user2.init(obj.subject);
      this.user2 = user2;

    } else {
      this.type = 'star';

      let user2 = new User();
      user2.init(obj.subject.user);
      this.user2 = user2;

      this.post = new PostInfo();
      this.post.init(obj.subject);
    }

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
