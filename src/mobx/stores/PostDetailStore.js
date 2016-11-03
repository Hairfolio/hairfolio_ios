import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';
import {_, moment, React, Text} from 'hairfolio/src/helpers';
import Post from 'stores/Post';

import * as routes from 'hairfolio/src/routes';

class PostDetailStore {
  @observable post;
  @observable isLoading;
  @observable selectedIndex = 0;
  @observable showTags = false;

  constructor() {
    let p = new Post();
    p.samplePost();
    this.post = p;
  }

  back() {
    window.navigators[0].jumpTo(routes.appStack);
  }


  @computed get numberOfTags() {
    return this.selectedPicture.tags.length;
  }


  @computed get tagImage() {
    if (this.showTags) {
      return require('img/feed_white_tags_on.png');
    } else {
      return require('img/feed_white_tags_off.png');
    }
  }


  @computed get selectedPicture() {
    return this.post.pictures[this.selectedIndex];
  }
}

const store = new PostDetailStore();

export default store;

