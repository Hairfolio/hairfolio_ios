import { observable } from 'mobx';
import { NativeModules } from 'react-native';
import ServiceBackend from '../../backend/ServiceBackend';
import Post from './Post';


let PhotoAlbum = NativeModules.PhotoAlbum;


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


    for (let a = 0; a < res.length; a++) {
      let post = new Post();
      await post.init(res[a]);
      this.elements.push(post);
    }


    this.isLoading = false;
  }

}

const store = new FeedStore();

export default store;

