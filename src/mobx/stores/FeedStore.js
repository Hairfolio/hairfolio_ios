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

import PostStore from 'stores/PostStore.js'

class FeedStore extends PostStore {
  async getPosts(pageNumber) {
    return ServiceBackend.get(`posts?page=${pageNumber}`);
  }
}

const store = new FeedStore();

export default store;

