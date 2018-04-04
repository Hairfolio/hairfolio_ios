import {observable, computed, action} from 'mobx';

import ServiceBackend from '../../backend/ServiceBackend';

import {_, moment, React, Text} from 'Hairfolio/src/helpers';

import PostListStore from './PostListStore';

const cache = {};

import {PostGridStore} from './PostStore';

export class UserPostStore extends PostGridStore {
  @observable lastUserId;

  @action setLastUserId(id) {
    this.lastUserId = id;
  }

  async getPosts(page) {
    let userId = this.initData;

    return await ServiceBackend.get(`users/${userId}/posts?page=${this.nextPage}`);
  }
}
