import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'
import UserStore from './UserStore';

import ServiceBackend from 'backend/ServiceBackend.js'
import Service from 'Hairfolio/src/services/index.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text, StatusBar} from 'Hairfolio/src/helpers';

import Post from 'stores/Post.js'

import PostStore, {PostGridStore} from 'stores/PostStore.js'

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

class TopTags extends PostStore {
  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      console.log('loadNextPage', this.nextPage);
      this.isLoadingNextPage = true;

      let myId = UserStore.user.id;

      let res = (await ServiceBackend.get(`tags?popular=true&page=${this.nextPage}`));

      let {tags, meta} = res;

      let arr = [];

      for (let a = 0; a < tags.length; a++)  {
        let tagItem = new TagItem();
        await tagItem.init(tags[a]);
        this.elements.push(tagItem);
      }

      this.nextPage = meta.next_page

      this.isLoadingNextPage = false;
    }
  }
}

class PopularPosts extends PostGridStore {
  async getPosts(page) {
    return (await ServiceBackend.get(`posts?popular=true&page=${page}`));
  }
}

class SearchStore {
  @observable popularPosts;
  @observable topTags;
  @observable isLoading = false;
  @observable loaded;

  constructor() {
    this.elements = [];
    this.loaded = false;
    this.topTags = new TopTags();
    this.popularPosts = new PopularPosts();
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    return ds.cloneWithRows(
      [
        {type: 'searchBar'},
        {type: 'topTags'},
        {type: 'popularPostHeader'},
        ...this.popularPosts.list
      ]
    );
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

  reset() {
    this.elements = [];
    this.loaded = false;
    this.topTags = new TopTags();
    this.popularPosts = new PopularPosts();
  }
}

const store = new SearchStore();

export default store;

