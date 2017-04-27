import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Service from 'Hairfolio/src/services/index.js'

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'
import Post from 'stores/Post.js'

import ServiceBackend from 'backend/ServiceBackend.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import User from 'stores/User.js'
import {_, jpg, moment, React, Text} from 'Hairfolio/src/helpers';


class Message {

  @observable text;
  @observable user;
  @observable picture;
  @observable post;

  constructor() {
  }

  @computed get type() {
    if (this.post != null) {
      return 'post';
    } else if (this.picture != null) {
      return 'picture';
    } else {
      return 'text';
    }
  }

  @computed get isMe() {
    return this.user == null;
  }

  async init(obj) {

    let isMe = obj.user.id == Service.fetch.store.getState().user.data.get('id');

    if (!isMe) {
      let user = new User();
      await user.init(obj.user);
      this.user = user;
    }

    if (obj.post) {
      let post = new Post();
      await post.init(obj.post);
      this.post = post;
    } else if (obj.url) {
      let pic = {uri: obj.url};

      if (obj.url.indexOf('mov') > -1) {
        pic = {uri: jpg(obj.url)};
      }

      this.picture = new Picture(
        pic,
        pic,
        null
      );


      if (obj.url.indexOf('mov') > -1) {
        this.picture.videoUrl = obj.url;
      }


    } else {
      this.text = obj.body;
    }

    return this;
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

  samplePost(isMe) {

    if (!isMe) {
      let user = new User();
      user.sample();
      this.user = user;
    }

    let post = new Post();
    post.samplePost();

    this.post = post;
  }
}

class LoadingStore {
  @observable isLoading = false;
  @observable loadingText = 'Uploading ...';
}

class MessageDetailsStore {
  @observable messages = [];
  @observable isLoading = false;
  @observable inputText = '';

  @observable loadingStore = new LoadingStore();

  @observable title = 'First Last Name';

  constructor() {

    this.load();
  }

  async createConversation(users) {
    this.isLoading = true;
    this.messages = [];

    let ids = users.map(e => e.user.id);

    let userId = Service.fetch.store.getState().user.data.get('id');
    ids.push(userId);

    let postData = {
      sender: Service.fetch.store.getState().user.data.get('id'),
      conversation: {
        sender_id: userId,
        recipient_ids: ids
      }
    };


    let res = (await ServiceBackend.post('conversations', postData)).conversation;

    this.loadMessages(res.id);
  }

  async loadMessages(id) {
    this.isLoading = true;
    this.id = id;

    // read the conversations
    ServiceBackend.post(`conversations/${this.id}/read`);
    let res = (await ServiceBackend.get(`conversations/${this.id}/messages`)).messages;

    this.messages = (await Promise.all(res.map(e => {
      let c = new Message();
      return c.init(e);
    }))).reverse();

    this.isLoading = false;
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
    this.loadingStore.isLoading = false;
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
    message.samplePost(false);
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


    message = new Message();
    message.samplePost(true);
    arr.push(message);

    this.messages = arr;

    this.isLoading = false;
  }

  scrollToBottom() {
    if (this.scrollView) {
      const scrollHeight = this.contentHeight - this.scrollViewHeight;
      if (scrollHeight > 0) {
        const scrollResponder = this.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollTo({x: 0, y: scrollHeight, animated: false});
      }
    }
  }

  async sendText() {
    let msg = new Message();
    msg.text = this.inputText;
    this.inputText = '';

    this.messages.push(msg);


    let postData = {
      message: {
        body: msg.text
      }
    };

    await ServiceBackend.post(`conversations/${this.id}/messages`, postData);

  }

  async sendVideo(response) {

    this.loadingStore.isLoading = true;

    let msg = new Message();
    let pic = {uri: response.uri, isStatic: true};

    msg.picture = new Picture(
      pic,
      pic,
      null
    );

    let uri = response.uri;

    msg.picture.videoUrl = uri;


    // send to cloudinary
    let res = await msg.picture.uploadVideo();

    pic = {uri: jpg(res.secure_url)};

    msg.picture = new Picture(
      pic,
      pic,
      null
    );

    msg.picture.videoUrl = res.secure_url;

    this.messages.push(msg)

    this.loadingStore.isLoading = false;

    setTimeout(() => this.scrollToBottom(), 100)

    let postData = {
      message: {
        body: '',
        url: res.secure_url
      }
    };

    let res2 = await ServiceBackend.post(`conversations/${this.id}/messages`, postData);

  }

  async sendPicture(response) {


    this.loadingStore.isLoading = true;

    let msg = new Message();
    let pic = {uri: response.uri, isStatic: true};

    msg.picture = new Picture(
      pic,
      pic,
      null
    );

    // send to cloudinary
    let res = await msg.picture.toJSON();

    pic = {uri: res.asset_url, isStatic: true};

    msg.picture = new Picture(
      pic,
      pic,
      null
    );

    this.messages.push(msg)

    this.loadingStore.isLoading = false;

    setTimeout(() => this.scrollToBottom(), 100)

    let postData = {
      message: {
        body: '',
        url: res.asset_url
      }
    };

    await ServiceBackend.post(`conversations/${this.id}/messages`, postData);
  }

  @observable text;
}


const store = new MessageDetailsStore();

window.messageDetailsStore = store;

export default store;

