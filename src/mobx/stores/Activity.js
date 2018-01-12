import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'Hairfolio/src/helpers';

import User from 'stores/User.js'

class PostInfo {
  @observable picture;

  constructor() {
  }

  init(obj) {
    this.id = obj.id;
    let picObj =  {uri: obj.photos[0].asset_url};
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
    await user.init(obj.initiator);
    this.user = user;

    if (obj.notifiable_type  == 'Follow') {
      this.type = 'follow';

      let user2 = new User();
      await user2.init(obj.user);
      this.user2 = user2;

    } else if (obj.notifiable_type  == 'Like') {
      this.type = 'star';

      let user2 = new User();
      await user2.init(obj.user);
      this.user2 = user2;

      this.post = new PostInfo();
      this.post.init(obj.notifiable.post);
    } else {
      console.log('Unknown Notification type', obj.notifiable_type);
    }

    return this;
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
