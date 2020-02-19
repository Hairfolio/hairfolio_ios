import { computed, observable } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import NavigatorStyles from '../../common/NavigatorStyles';
import { PostGridStore } from './PostStore';

class TagPostModel extends PostGridStore {
  @observable title = '#myTag'

  async getPosts(page) {

    let name = this.initData;


    if (name !== "" || name.length > 0) {
      let res = await ServiceBackend.get(`tags/exact?q=${name}`);
      let tagId;

      if (res == null) {
        let tag = (await ServiceBackend.post('tags', { tag: { name: name } })).tag;

        tagId = tag.id;
      } else {
        tagId = res.tag.id;
      }
      if(tagId){
        return ServiceBackend.get(`tags/${tagId}/posts?page=${page}`);
      }
    }
  }
}


class TagPostStore {

  @observable stack = [];
  jump(name, title, navigator, from_where) {
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
      passProps: {
        [from_where]: true
      }
    });

    /* if(from_where == 'from_feed'){
      navigator.push({
        screen: 'hairfolio.TagPosts',
        navigatorStyle: NavigatorStyles.tab,
        passProps: { 
          from_feed:true       
        }
      });

    }else if(from_where == 'from_search'){
      navigator.push({
        screen: 'hairfolio.TagPosts',
        navigatorStyle: NavigatorStyles.tab,
        passProps: { 
          from_search:true       
        }
      });

    }else{
      navigator.push({
        screen: 'hairfolio.TagPosts',
        navigatorStyle: NavigatorStyles.tab,
        passProps: {        
        }
      });
    } */

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
