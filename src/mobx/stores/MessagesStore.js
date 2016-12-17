import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'
import Service from 'hairfolio/src/services/index.js'

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
    console.log('initMessage', obj);

    this.id = obj.id;



    let lastMessage = obj.last_message;

    this.createdTime = moment(obj.last_message.created_at);

    this.isNew = !lastMessage.read;

    let user = new User();
    await user.init(lastMessage.user);
    this.user = user;

    if (lastMessage.post != null) {
      this.text = 'shared a post';

      let pic = {uri: lastMessage.post.photos[0].asset_url};

      this.picture = new Picture(
        pic,
        pic,
        null
      );
    } else if (lastMessage.url && lastMessage.url.length > 0) {
      this.text = 'shared a picture';

      let pic = {uri: lastMessage.url };

      this.picture = new Picture(
        pic,
        pic,
        null
      );

    } else {
      this.text = lastMessage.body;
    }

    if (lastMessage.user.id == Service.fetch.store.getState().user.data.get('id')) {
      this.text = 'You : ' + this.text;
    }



    return this;
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

    this.messages = await Promise.all(res.map(e => {
      let c = new Message();
      return c.init(e);
    }));

    this.isLoading = false;
  }

  async delete(message) {
    console.log('delete');

    this.messages = this.messages.filter(e => e != message);

    let res = await ServiceBackend.delete(`conversations/${message.id}`);
    console.log('delete res', res);

  }

}



const store = new MessagesStore();

export default store;
