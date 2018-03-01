import {observable, computed, action} from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import {_, moment, React, Text} from 'Hairfolio/src/helpers';
import PostListStore from './PostListStore';
import {PostGridStore} from './PostStore';
import NavigatorStyles from '../../common/NavigatorStyles';

class TagPostModel extends PostGridStore {
  @observable title = '#myTag'

  async getPosts(page) {
    let name = this.initData;

    let res = await ServiceBackend.get(`tags/exact?q=${name}`);
    let tagId;

    if (res == null) {
      let tag = (await ServiceBackend.post('tags', {tag: {name: name}})).tag;
      tagId = tag.id;
    } else {
      tagId = res.tag.id;
    }

    return ServiceBackend.get(`tags/${tagId}/posts?page=${page}`);
  }
}


class TagPostStore {

  @observable stack = [];
  jump(name, title, navigator) {
    let tagStore = new TagPostModel();
    tagStore.title = title;
    tagStore.load(name)
    tagStore.myBack = () => {
      navigator.pop({
        animated: true,
      })
      this.stack.pop();
    }
    this.stack.push(tagStore);
    navigator.push({
      screen: 'hairfolio.TagPosts',
      navigatorStyle: NavigatorStyles.tab,
    });
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
