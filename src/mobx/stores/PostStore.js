import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';

import {v4} from 'uuid';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';

import Post from './Post';

export default class PostStore {
  @observable elements = [];

  @observable isLoading = false;
  @observable nextPage

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
    this.isLoadingNextPage = false;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      console.log('loadNextPage', this.nextPage);
      this.isLoadingNextPage = true;
      let res = (await this.getPosts(this.nextPage));

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

  get supportPaging() {
    return true;
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.elements = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }
}

export class PostGridStore extends PostStore {

  @computed get list() {
    let arr = this.elements.slice();

    let newArr = [];

    let counter = 0;

    while (counter < arr.length) {
      if (counter + 1 < arr.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }

    return newArr;
  }
  @computed get dataSource() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    return ds.cloneWithRows(this.list);
  }
}
