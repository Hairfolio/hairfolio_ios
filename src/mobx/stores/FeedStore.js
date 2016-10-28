import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';


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

class Post {
  @observable description
  @observable pictures
  @observable currentIndex = 0
  @observable key = v4()
  @observable creator
  @observable createdTime;
  @observable hasStarred;
  @observable starNumber;
  @observable numberOfComments;
  @observable numberOfTags;
  @observable showStar;
  @observable showSave;

  @computed get currentImage() {
    return this.pictures[this.currentIndex];
  }

  @computed get starImageSource() {
    if (this.hasStarred) {
      return require('img/feed_star_on.png');
    } else {
      return require('img/feed_star_off.png');
    }
  }

  @computed get photoInfo() {
    return `${this.currentIndex + 1} of ${this.pictures.length}`;
  }

  getTimeDifference() {
    return this.createdTime.toNow(true);
  }

  samplePost() {
    this.description = 'This is a test';
    this.pictures = [];


    this.starNumber = 428;
    this.numberOfComments = 52;
    this.hasStarred = false;
    this.numberOfTags = 4;


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

class FeedStore {
  @observable elements;

  constructor() {
    this.elements = [];

    let post = new Post();
    post.samplePost();
    this.elements.push(post);
  }

}

const store = new FeedStore();

export default store;

