import {observable, computed, action} from 'mobx';

import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import PostListStore from 'stores/PostListStore'

class TagPostStore extends PostListStore  {
  @observable title = '#myTag'

  async backendCall(name) {

    let res = await ServiceBackend.get(`tags/exact?q=${name}`);

    let tagId;

    if (res == null) {
      let tag = (await ServiceBackend.post('tags', {tag: {name: name}})).tag;
      tagId = tag.id;
    } else {
      tagId = res.tag.id;
    }

    return await ServiceBackend.get(`tags/${tagId}/posts`);
  }
}

const store = new TagPostStore();

export default store;
