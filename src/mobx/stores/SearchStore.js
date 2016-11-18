import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'
import Service from 'hairfolio/src/services/index.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text, StatusBar} from 'hairfolio/src/helpers';

import Post from 'stores/Post.js'

class TopTags {
  @observable isLoading = false;
  @observable elements = [];

  async load() {
    this.isLoading = true;

    let myId = Service.fetch.store.getState().user.data.get('id')

    let res = await ServiceBackend.get('posts');
    this.elements = [];

    for (let a = 0; a < res.length; a++)  {
      let post = new Post();
      await post.init(res[a]);
      if (post.hashTags.length > 0) {
        this.elements.push(post);
      }
    }
    this.isLoading = false;
  }
}

class PopularPosts {
  @observable isLoading;
  @observable elements = [];

  async load() {
    this.isLoading = true;

    let myId = Service.fetch.store.getState().user.data.get('id')

    let res = await ServiceBackend.get('posts/popular');
    this.elements = [];

    for (let a = 0; a < res.length; a++)  {
      let post = new Post();
      await post.init(res[a]);
      this.elements.push(post);
    }
    this.isLoading = false;
  }
}

class SearchStore {
  @observable popularPosts = new PopularPosts();
  @observable topTags = new TopTags();
  @observable isLoading = false;

  constructor() {
    this.elements = [];
    this.loaded = false;
  }


  refresh() {
    this.loaded = false;
  }

  async load() {
    if (!this.loaded) {
      this.popularPosts.load();
      this.topTags.load();
      this.loaded = true;
    }
  }
}

const store = new SearchStore();

export default store;

