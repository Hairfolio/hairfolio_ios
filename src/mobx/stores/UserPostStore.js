import {observable, computed, action} from 'mobx';

import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import PostListStore from 'stores/PostListStore'

class UserPostStore extends PostListStore  {
  async backendCall(userId) {
    return await ServiceBackend.get(`posts?user_id=${userId}`);
  }
}

const store = new UserPostStore();

export default store;
