import { observable } from 'mobx';
import { NativeModules } from 'react-native';
import Post from './Post';

let PhotoAlbum = NativeModules.PhotoAlbum;

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


    for (let a = 0; a < res.length; a++) {
      let post = new Post();
      await post.init(res[a]);
      this.elements.push(post);
    }

    this.isLoading = false;
  }
}
