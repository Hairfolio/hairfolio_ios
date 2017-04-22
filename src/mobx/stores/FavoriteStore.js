import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'


import {v4} from 'uuid';

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import Post from 'stores/Post.js'

import Service from 'hairfolio/src/services/index.js'
import ServiceBackend from 'backend/ServiceBackend.js'

import PostStore, {PostGridStore} from 'stores/PostStore.js'

class FavoriteStore extends PostGridStore {
  async getPosts(page) {
    return (await ServiceBackend.get(`posts?favorites=true&page=${page}`));
  }
}

const store = new FavoriteStore();

export default store;
