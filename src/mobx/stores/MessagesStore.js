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
    // this.load();
  }

  async load() {
    this.isLoading = true;
    this.messages = [];

    let res = (await ServiceBackend.get('conversations')).conversations;

    this.messages = res.map(e => new Message(e));

    this.isLoading = false;
  }

  delete(message) {
    // todo backend
    this.messages = this.messages.filter(e => e != message);
  }

}



const store = new MessagesStore();

export default store;
