import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from './Picture';
import ServiceBackend from '../../backend/ServiceBackend';
import {_, v4, jpg, getUserId,  moment, React, Text} from 'Hairfolio/src/helpers';
import User from './User';
import UserStore from './UserStore';
import Service from 'Hairfolio/src/services/index';

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
    this.id = obj.id;

    let lastMessage = obj.last_message;

    this.createdTime = moment(obj.last_message.created_at);

    this.isNew = obj.unread_messages;

    let user = new User();


    for (let recipient of obj.recipients) {
      if (recipient.id != getUserId()) {
        await user.init(recipient);
        break;
      }
    }

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

      if (lastMessage.url.endsWith('mov')) {
        this.text = 'shared a video';

        let pic = {uri: jpg(lastMessage.url)};

        this.picture = new Picture(
          pic,
          pic,
          null
        );

        this.picture.videoUrl = lastMessage.url;
      } else {
        this.text = 'shared a picture';

        let pic = {uri: lastMessage.url};

        this.picture = new Picture(
          pic,
          pic,
          null
        );
      }

    } else {
      this.text = lastMessage.body;
    }

    if (lastMessage.user.id == UserStore.user.id) {
      this.text = 'You: ' + this.text;
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

    res = res.filter(e => e.last_message != null);

    this.messages = await Promise.all(res.map(e => {
      let c = new Message();
      return c.init(e);
    }));

    this.isLoading = false;
  }

  async delete(message) {
    this.messages = this.messages.filter(e => e != message);

    let res = await ServiceBackend.delete(`conversations/${message.id}`);
  }

}



const store = new MessagesStore();

export default store;
