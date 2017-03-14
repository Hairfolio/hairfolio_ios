import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import ServiceBackend from 'backend/ServiceBackend.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Post from 'stores/Post.js'

class FeedStore {
  @observable elements = [];

  @observable isLoading = false;

  constructor() {
    this.elements = [];
    this.hasLoaded = false;
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    return ds.cloneWithRows(this.elements.slice());
  }

  reset() {
    this.hasLoaded = false;
    this.elements = [];
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage) {
      this.isLoadingNextPage = true;
      let res = (await ServiceBackend.get(`posts?page=${this.nextPage}`));

      let {posts, meta} = res;

      for (let a = 0; a < posts.length; a++)  {
        let post = new Post();
        await post.init(posts[a]);
        this.elements.push(post);
      }

      this.nextPage = meta.next_page

      this.isLoadingNextPage = false;
    }


  }

  async load() {
    this.isLoading = true;

    this.elements = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }

}

const store = new FeedStore();

export default store;

