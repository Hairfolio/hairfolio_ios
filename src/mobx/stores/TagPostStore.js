import {observable, computed, action} from 'mobx';

import ServiceBackend from 'backend/ServiceBackend.js'

import {_, moment, React, Text} from 'hairfolio/src/helpers';

import PostListStore from 'stores/PostListStore'


import * as routes from 'hairfolio/src/routes';

class TagPostModel extends PostListStore  {
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


class TagPostStore {

  @observable stack = [];

  jump(name, title, onBack = () => window.navigators[0].jumpTo(routes.appStack)) {
    ;
    let tagStore = new TagPostModel();
    tagStore.title = title;
    tagStore.load(name)
    tagStore.myBack = () => {
      onBack();
      this.stack.pop();
    }
    this.stack.push(tagStore);

    window.navigators[0].jumpTo(routes.tagPosts);
  }

  @computed get isEmpty() {
    return this.stack.length == 0;
  }

  @computed get currentStore() {
    if (!this.isEmpty) {
      let s = this.stack[this.stack.length - 1];
      return s;
    } else {
      return null;
    }
  }

  clear() {
    this.stack = [];
  }
}

const store = new TagPostStore();

export default store;
