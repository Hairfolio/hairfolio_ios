import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Post from 'stores/Post.js'

import Service from 'hairfolio/src/services/index.js'
import ServiceBackend from 'backend/ServiceBackend.js'

class FavoriteStore {
  @observable elements;
  @observable isLoading = false;

  constructor() {
    this.elements = [];

    /*
    for (let i = 0; i < 4; i++) {
      let post = new Post();
      post.samplePost(i);
      this.elements.push(post);
    }
    */
  }

  async load() {

    this.isLoading = true;

    let myId = Service.fetch.store.getState().user.data.get('id')
    console.log('myId', myId);

    let res = await ServiceBackend.get(`/users/${myId}/starred_posts`);
    this.elements = [];

    for (let a = 0; a < res.length; a++)  {
      let post = new Post();
      await post.init(res[a]);
      this.elements.push(post);
    }

    this.isLoading = false;
  }

}

const store = new FavoriteStore();

export default store;

