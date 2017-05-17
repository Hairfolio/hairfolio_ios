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

export default class PostListStore {
  @observable elements = [];
  @observable isLoading = false;

  constructor() {
    this.elements = [];
  }

  async load(data) {
    this.isLoading = true;

    let res = (await this.backendCall(data)).posts;
    this.elements = [];


    for (let a = 0; a < res.length; a++)  {
      let post = new Post();
      await post.init(res[a]);
      this.elements.push(post);
    }

    this.isLoading = false;
  }
}
