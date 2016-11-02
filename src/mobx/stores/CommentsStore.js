import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Picture from 'stores/Picture.js'

import {_, v4, moment, React, Text} from 'hairfolio/src/helpers';

class User {
  @observable profilePicture;
  @observable name;

  sample() {
    let picObj = require('img/feed_example_profile.png');
    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );

    this.name = 'First Last name';
  }
}

class Comment {
  @observable user;
  @observable text;
  @observable createdTime;

  constructor() {
    this.key = v4();
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

class CommentsStore {
  @observable comments = [];
  @observable isLoading = false;

  @observable inputStore= new InputStore();

  constructor() {

    let texts = [
      ' Aenean lacinia bibendum nulla sed consectetur.  Lorem ipsum dolor sit amet, consectetur adipisc elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Hi ',
      'Have you tested these comments?',
      'They seem to work?',
      'Can you also send me a message?',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'Fringilla Condimentum Pharetra Tortor Risus',
      'test',
    ];

    texts.forEach((text) => {
      let comment = new Comment();
      comment.sample(text);
      this.comments.push(comment);
    });
  }

  @computed get isEmpty() {
    return this.comments.length == 0;
  }

  @action send() {
    console.log('send');
    let text = this.inputStore.value;
    this.inputStore.value = '';
    let comment = new Comment();
    comment.sample(text);
    this.comments.push(comment);

    // have a timeout the view is rerrenderd before
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

const store = new CommentsStore();

export default store;

