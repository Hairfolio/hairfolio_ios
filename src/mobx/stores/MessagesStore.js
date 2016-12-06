import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'

import * as routes from 'hairfolio/src/routes.js'

class Message {
  @observable user;
  @observable text;
  @observable createdTime;
  @observable isNew;
  @observable picture;

  constructor(obj) {
    this.key = v4();
  }

  async init(obj) {
      /* TODO
    console.log('initComment', obj);
    this.text = obj.comment;
    this.user = new User();

    // TODO BACKEND INTEGRATION
    this.createdTime = moment().subtract({hours: 2});
    this.isNew  = obj.isNew;

    await this.user.init(obj.user);
    return this;
    */
  }

  @computed get timeDifference() {
    return this.createdTime.toNow(true);
  }

  sample(text, isNew, showPicture) {
    this.createdTime = moment().subtract({hours: 2});
    let user = new User();
    user.sample();
    this.user = user;
    this.isNew = isNew;
    this.text = text;

    if (showPicture) {

      let pic = require('img/feed_example4.png');

      this.picture = new Picture(
        pic,
        pic,
        null
      );
    }
  }
}


class MessagesStore {
  @observable messages = [];
  @observable isLoading = false;

  @computed get isEmpty() {
    return this.messages.length == 0;
  }

  get noElementsText() {
    return 'There have been no messages yet.'
  }

  constructor() {
    this.load();
  }

  async load() {
    this.isLoading = true;
    this.messages = [];

    let arr = [];

    let message = new Message();
    message.sample('Fringilla Condimentum Pharetra Tortor Lorem', true, true);
    arr.push(message);

    let msg2 = new Message();
    msg2.sample('Fringilla Condimentum Pharetra Tortor Lorem', false, false);
    arr.push(msg2);


    let msg3 = new Message();
    msg3.sample('Fringilla Condimentum Pharetra Tortor Lorem', false, true);
    arr.push(msg3);


    this.messages = arr;



    /* TODO BACKEND INTEGRATION
    let res = await ServiceBackend.get(`/posts/${this.postId}/comments`);

    let myComments = await Promise.all(res.map(e => {
      let c = new Comment();
      return c.init(e);
    }));

    console.log('myComments', myComments);

    this.comments = myComments;
    */

    this.isLoading = false;
  }

  delete(message) {
    // todo backend
    this.messages = this.messages.filter(e => e != message);
  }

}



const store = new MessagesStore();

export default store;
