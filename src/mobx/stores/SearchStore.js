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

class TagItem {

  @observable picture;
  @observable name;

  constructor() {
    this.key = v4();
  }

  async init(obj) {
    this.name = obj.name;
    let picObj = {uri: obj.last_photo};
    this.picture = new Picture(
      picObj,
      picObj,
      null
    );
  }
}

class TopTags {
  @observable isLoading = false;
  @observable elements = [];

  async load() {
    this.isLoading = true;

    let myId = Service.fetch.store.getState().user.data.get('id')

    let res = (await ServiceBackend.get('tags?popular=true')).tags;
    this.elements = [];

    let arr = [];

    for (let a = 0; a < res.length; a++)  {
      let tagItem = new TagItem();
      await tagItem.init(res[a]);
      arr.push(tagItem);
    }

    this.elements = arr;

    this.isLoading = false;
  }
}

class PopularPosts {
  @observable isLoading;
  @observable elements = [];

  async load() {
    this.isLoading = true;

    let myId = Service.fetch.store.getState().user.data.get('id')

    let res = (await ServiceBackend.get('posts?popular=true')).posts;
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

