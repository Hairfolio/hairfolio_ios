import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Post from 'stores/Post.js'

class FeedStore {
  @observable elements;

  constructor() {
    this.elements = [];

    for (let i = 0; i < 2; i++) {
      let post = new Post();
      post.samplePost();
      this.elements.push(post);
    }
  }

}

const store = new FeedStore();

export default store;

