import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';



import User from 'stores/User.js'
import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Post from 'stores/Post.js'

class Message {

  @observable text;
  @observable user;
  @observable picture;

  constructor() {
  }

  @computed get type() {
    if (this.text != null) {
      return 'text';
    } else {
      return 'picture';
    }
  }

  @computed get isMe() {
    return this.user == null;
  }

  sampleText(isMe, text) {

    if (!isMe) {
      let user = new User();
      user.sample();
      this.user = user;
    }

    this.text = text;
  }



  samplePicture(isMe) {

    if (!isMe) {
      let user = new User();
      user.sample();
      this.user = user;
    }


    let pic = require('img/feed_example4.png');

    this.picture = new Picture(
        pic,
        pic,
        null
      );
  }
}

class MessageDetailsStore {
  @observable messages = [];
  @observable isLoading = false;
  @observable inputText = '';

  @observable title = 'First Last Name';

  constructor() {

    this.load();
  }

  @computed get sendBtnOpacity() {
    if (this.inputText.length == 0) {
      return 0.5;
    } else {
      return 1;
    }
  }

  async load() {
    this.isLoading = true;
    this.elements = [];
    this.inputText = '';

    let arr = [];

    let message = new Message();
    message.sampleText(false, 'very short');

    arr.push(message);

    message = new Message();
    message.sampleText(false, 'this text is going to be much longer even more than one');

    arr.push(message);


    message = new Message();
    message.samplePicture(false);
    arr.push(message);

    message = new Message();
    message.sampleText(true, 'your last message');
    arr.push(message);


    message = new Message();
    message.sampleText(true, 'a text that goes longer from you');
    arr.push(message);

    message = new Message();
    message.samplePicture(true);
    arr.push(message);

    this.messages = arr;

    this.isLoading = false;
  }

  scrollToBottom() {
    const scrollHeight = this.contentHeight - this.scrollViewHeight;
    if (scrollHeight > 0) {
      const scrollResponder = this.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollTo({x: 0, y: scrollHeight});
    }
  }

  sendText() {
    let msg = new Message();
    msg.text = this.inputText;
    this.inputText = '';

    this.messages.push(msg);
  }

  @observable text;
}

const store = new MessageDetailsStore();

export default store;

