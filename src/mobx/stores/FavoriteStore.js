import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from './FilterStore';
import Picture from './Picture';


import {v4} from 'uuid';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';

import Post from './Post';

import Service from 'Hairfolio/src/services/index';
import ServiceBackend from '../../backend/ServiceBackend';

import PostStore, {PostGridStore} from './PostStore';

class FavoriteStore extends PostGridStore {
  async getPosts(page) {
    return (await ServiceBackend.get(`posts?favorites=true&page=${page}`));
  }
}

const store = new FavoriteStore();

export default store;
