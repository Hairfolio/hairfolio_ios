import { moment, v4 } from 'Hairfolio/src/helpers';
import { computed, observable } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import NavigatorStyles from '../../common/NavigatorStyles';
import User from './User';
import FeedStore from '../stores/FeedStore';
import PostDetailStore from '../stores/PostDetailStore';
// import PostStore from '../stores/PostStore';
import { showLog } from '../../helpers';
import PostStore from './PostStore';
import  HairfolioStore  from '../stores/HairfolioStore';
import FavouriteStore from '../stores/FavoriteStore';

class Comment {
  @observable user;
  @observable text;
  @observable createdTime;
  

  constructor(obj) {
    this.key = v4();
  }

  async init(obj) {
    this.text = obj.body;
    this.user = new User();

    this.createdTime = moment(obj.created_at);

    await this.user.init(obj.user);
    return this;
  }

  @computed get timeDifference() {
    return this.createdTime.toNow(true);
  }

  sample(text) {
    this.createdTime = moment().subtract({ hours: 2 });
    let user = new User();
    user.sample();
    this.user = user;
    this.text = text;
  }
}


class InputStore {
  @observable value;

  @computed get isEmpty() {
    return !this.value || this.value.length == 0;
  }
}

class CommentsModel {
  @observable comments = [];
  @observable isLoading = false;

  @observable inputStore = new InputStore();

  @computed get isEmpty() {
    return this.comments.length == 0;
  }

  get noElementsText() {
    return 'There have been no comments yet.'
  }

  constructor(postId) {

    this.currentPostId  = postId
    this.lastCount = "";
    this.postId = postId;
    this.load();
  }

  async load() {
    this.isLoading = true;
    this.comments = [];
    let res = (await ServiceBackend.get(`posts/${this.postId}/comments`)).comments;

    let myComments = await Promise.all(res.map(e => {
      let c = new Comment();
      return c.init(e);
    }));

    this.comments = myComments;

    this.isLoading = false;
  }

  async send() {
    let text = this.inputStore.value;
    this.inputStore.value = '';

    let postData = {
      comment: {
        body: text
      }
    };

    let res = (await ServiceBackend.post(`posts/${this.postId}/comments`, postData)).comment;

    let comment = new Comment();
    await comment.init(res);
    this.comments.push(comment);

    setTimeout(() => {
      
      this.scrollToBottom();

      
      if (PostDetailStore.currentStore) {
        if (PostDetailStore.currentStore.post) {
          if (this.currentPostId == PostDetailStore.currentStore.post.id) {
            showLog("POST COMMENT 1")
            let numOfComment = PostDetailStore.currentStore.post.numberOfComments
            PostDetailStore.currentStore.post.numberOfComments = numOfComment + 1
            this.lastCount = PostDetailStore.currentStore.post.numberOfComments
          }
        }
        else {
          if (this.currentPostId == PostDetailStore.currentStore.id) {
            showLog("POST COMMENT 2")
            let numOfComment = PostDetailStore.currentStore.numberOfComments
            PostDetailStore.currentStore.numberOfComments = numOfComment + 1
            this.lastCount = PostDetailStore.currentStore.post.numberOfComments
          }
        }

      }


      FeedStore.elements.filter((e, index) => {

        if (e.id == this.currentPostId) {

          let data = FeedStore.elements[index];
          let numOfComment = data.numberOfComments

          // showLog("POST COMMENT 3" + "last count ==> " + this.lastCount + "num of comment ==>" + numOfComment)

          let total = numOfComment + 1

          if (parseInt(this.lastCount) < total) {
            showLog("POST COMMENT 4")
            data.numberOfComments = this.lastCount
          }
          else {
            showLog("POST COMMENT 5")
            data.numberOfComments = numOfComment + 1
          }

          FeedStore.elements[index] = data
        }
      });

        HairfolioStore.load()
        FavouriteStore.load();

    }, 100);
  }

  scrollToBottom() {
    if (this.scrollView) {
      const scrollHeight = this.contentHeight - this.scrollViewHeight;
      if (scrollHeight > 0) {
        const scrollResponder = this.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollTo({ x: 0, y: scrollHeight });
      }
    }
  }

}


class CommentsStore {

  @observable currentPostId = "";
  @observable lastCount = "";
  @observable stack = [];

  jump(postId, navigator, from_where) {
    this.currentPostId = postId;
    let store = new CommentsModel(postId);
    store.myBack = () => {
      navigator.pop({ animated: true });
      this.stack.pop();
    }

    this.stack.push(store);

    navigator.push({
      screen: 'hairfolio.Comments',
      navigatorStyle: NavigatorStyles.tab,
      passProps: {
        [from_where]: true
      }
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

const store = new CommentsStore();

export default store;
