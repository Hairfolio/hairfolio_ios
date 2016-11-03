import {
  _, // lodash
  v4,
  observer, // mobx
  observable,
  computed,
  moment,
  action,
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import Picture from 'stores/Picture.js'

class User {
  @observable profilePicture;
  @observable name;

  constructor() {
  }

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

export default class Post {
  @observable description
  @observable pictures
  @observable currentIndex = 0
  @observable key = v4()
  @observable creator
  @observable createdTime;
  @observable hasStarred;
  @observable starNumber;
  @observable numberOfComments;
  @observable showStar;
  @observable showSave;

  @computed get currentImage() {
    return this.pictures[this.currentIndex];
  }

  @computed get numberOfTags() {
    let counter = 0;

    for (let picture of this.pictures) {
      counter += picture.tags.length;
    }

    return counter;
  }


  @computed get hashTags() {
    let hashTags = [];
    for (let pic of this.pictures) {
      for (let h of pic.tags) {
        if (h.hashtag) {
          hashTags.push(h);
        }
      }
    }
    return hashTags;
  }

  @computed get starImageSource() {
    if (this.hasStarred) {
      return require('img/feed_star_on.png');
    } else {
      return require('img/feed_star_off.png');
    }
  }


  @computed get starImageSourceWhite() {
    if (this.hasStarred) {
      return require('img/feed_white_star_on.png');
    } else {
      return require('img/feed_white_star_off.png');
    }
  }

  @computed get photoInfo() {
    return `${this.currentIndex + 1} of ${this.pictures.length}`;
  }

  getTimeDifference() {
    return this.createdTime.toNow(true);
  }

  samplePost() {
    this.description = 'This is a test description that should go to at least two lines so we can test it properly.';
    this.pictures = [];

    this.starNumber = 428;
    this.numberOfComments = 52;
    this.hasStarred = false;


    let user = new User();
    user.sample();
    this.creator = user;

    this.createdTime = moment().subtract({minutes: 2});


    let pictureObj = {uri: 'assets-library://asset/asset.JPG?id=106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001&ext=JPG' }

    let pictureObj2 = require('img/feed_example1.png');
    let pictureObj3 = require('img/feed_example2.png');
    let pictureObj4 = require('img/feed_example3.png');



    for (let obj of [pictureObj2, pictureObj3, pictureObj4]) {
      this.pictures.push(
        new Picture(
          obj,
          obj,
          null
        )
      );
    }

    this.pictures[0].addHashTag(60, 50, 'beautiful');
    this.pictures[0].addHashTag(300, 250, 'test');

    this.pictures[0].addHashTag(100, 60, 'life');

    this.pictures[1].addLinkTag(80, 200,
      {
        linkUrl: 'http://www.google.com',
        name: 'My Link',
        hashtag: {name: 'test'}
      }
    );

    this.pictures[2].addServiceTag(90, 100,
      {
        service_id: 4,
        line_id: 5,
        colors: [
          {
            id: 3,
            code: 'A3',
            hex: '352423',
            start_hex: '352423',
            end_hex: '975fa4'
          },
          {
            id: 10,
            code: 'B3',
            hex: '7ba3ce',
            start_hex: '7ba3ce',
            end_hex: '080c4f'
          }
        ],
        developer_volume: 50,
        developer_amount: 15,
        developer_time: 20
      }
    );
  }

  @action starPost() {
    this.showStar = true;
    this.hasStarred = !this.hasStarred;

    setTimeout(() => {
      this.showStar = false;
    }, 1500);
  }

  @action savePost() {
    this.showSave = true;

    setTimeout(() => {
      this.showSave = false;
    }, 1500);
  }
}
