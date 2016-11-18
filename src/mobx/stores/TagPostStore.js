import {observable, computed, action} from 'mobx';

import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import PostListStore from 'stores/PostListStore'

class TagPostStore extends PostListStore  {
  @observable title = '#myTag'

  async backendCall(name) {
    return await ServiceBackend.get(`posts?hashtag=${name}`);
  }
}

const store = new TagPostStore();

export default store;
