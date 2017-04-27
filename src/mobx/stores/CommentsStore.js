import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment, React, Text} from 'Hairfolio/src/helpers';

import User from 'stores/User.js'

import * as routes from 'Hairfolio/src/routes.js'

class Comment {
  @observable user;
  @observable text;
  @observable createdTime;

  constructor(obj) {
    this.key = v4();
  }

  async init(obj) {
    this.text = obj.body;
    this.user = new User();

    this.createdTime = moment(obj.created_at);

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

class CommentsModel {
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
    let res = (await ServiceBackend.get(`/posts/${this.postId}/comments`)).comments;

    let myComments = await Promise.all(res.map(e => {
      let c = new Comment();
      return c.init(e);
    }));

    this.comments = myComments;

    this.isLoading = false;
  }

  async send() {
    let text = this.inputStore.value;
    this.inputStore.value = '';

    let postData = {
      comment: {
        body: text
      }
    };

    let res = (await ServiceBackend.post(`/posts/${this.postId}/comments`, postData)).comment;

    let comment = new Comment();
    await comment.init(res);
    this.comments.push(comment);

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  scrollToBottom() {
    if (this.scrollView) {
      const scrollHeight = this.contentHeight - this.scrollViewHeight;
      if (scrollHeight > 0) {
        const scrollResponder = this.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollTo({x: 0, y: scrollHeight});
      }
    }
  }

}


class CommentsStore {

  @observable stack = [];

  jump(postId, onBack = () => window.navigators[0].jumpTo(routes.appStack)) {

    let store = new CommentsModel(postId);

    store.myBack = () => {
      onBack();
      this.stack.pop();
    }

    this.stack.push(store);

    window.navigators[0].jumpTo(routes.comments);
  }

  @computed get isEmpty() {
    return this.stack.length == 0;
  }

  @computed get currentStore() {
    if (!this.isEmpty) {
      let s = this.stack[this.stack.length - 1];
      return s;
    } else {
      return null;
    }
  }

  clear() {
    this.stack = [];
  }
}

const store = new CommentsStore();

export default store;
