import {observable, computed, action} from 'mobx';
import {CameraRoll, ListView, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from './FilterStore';
import Picture from './Picture';

import ServiceBackend from '../../backend/ServiceBackend';

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';

import Post from './Post';

import PostStore from './PostStore';

class FeedStore extends PostStore {
  async getPosts(pageNumber) {
    return ServiceBackend.get(`posts?page=${pageNumber}`);
  }
}

const store = new FeedStore();

export default store;

