import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'


let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';

import Post from 'stores/Post.js'

class FeedStore {
  @observable elements = [];

  @observable isLoading = false;

  constructor() {
    this.elements = [];
  }

  async load() {
    this.isLoading = true;

    let res = await ServiceBackend.get('posts');
    this.elements = [];


    for (let a = 0; a < res.length; a++)  {
      let post = new Post();
      await post.init(res[a]);
      this.elements.push(post);
    }


    this.isLoading = false;
  }

}

const store = new FeedStore();

export default store;

