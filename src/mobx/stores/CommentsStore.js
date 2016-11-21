import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

import User from 'stores/User.js'

class Comment {
  @observable user;
  @observable text;
  @observable createdTime;

  constructor(obj) {
    this.key = v4();
  }

  async init(obj) {
    console.log('initComment', obj);
    this.text = obj.comment;
    this.user = new User();

    // TODO BACKEND INTEGRATION
    this.createdTime = moment().subtract({hours: 2});

    await this.user.init(obj.user);
    return this;
  }

  @computed get timeDifference() {
    return this.createdTime.toNow(true);
  }

  sample(text) {
    this.createdTime = moment().subtract({hours: 2});
    let user = new User();
    user.sample();
    this.user = user;
    this.text = text;
  }
}


class InputStore {
  @observable value;

  @computed get isEmpty() {
    return !this.value || this.value.length == 0;
  }
}

export default class CommentsStore {
  @observable comments = [];
  @observable isLoading = false;

  @observable inputStore= new InputStore();

  @computed get isEmpty() {
    return this.comments.length == 0;
  }

  get noElementsText() {
    return 'There have been no comments yet.'
  }

  constructor(postId) {

    this.postId = postId;
    this.load();
  }

  async load() {
    this.isLoading = true;
    this.comments = [];
    let res = await ServiceBackend.get(`/posts/${this.postId}/comments`);

    let myComments = await Promise.all(res.map(e => {
      let c = new Comment();
      return c.init(e);
    }));

    console.log('myComments', myComments);

    this.comments = myComments;

    this.isLoading = false;
  }

  async send() {
    console.log('send');
    let text = this.inputStore.value;
    this.inputStore.value = '';

    let postData = {
      comment: {
        text
      }
    };

    let res = await ServiceBackend.post(`/posts/${this.postId}/comments`, postData);

    console.log('postRes', res);

    let comment = new Comment();
    await comment.init(res);
    this.comments.push(comment);

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  scrollToBottom() {
    console.log('scroll bottom');
    const scrollHeight = this.contentHeight - this.scrollViewHeight;
    console.log('scrollHeight', scrollHeight);
    if (scrollHeight > 0) {
      const scrollResponder = this.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollTo({x: 0, y: scrollHeight});
    }
  }

}
