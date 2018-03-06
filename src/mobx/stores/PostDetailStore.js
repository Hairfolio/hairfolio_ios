import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules, Linking} from 'react-native';
import Camera from 'react-native-camera';
import FilterStore from './FilterStore';
import Picture from './Picture';
import TagPostStore from './TagPostStore';
let PhotoAlbum = NativeModules.PhotoAlbum;
import {v4} from 'uuid';
import {_, moment, React, Text, ActionSheetIOS} from 'Hairfolio/src/helpers';
import Post from './Post';
import NavigatorStyles from '../../common/NavigatorStyles';

class PostDetailsModel {
  @observable post;
  @observable isLoading;
  @observable selectedIndex = 0;
  @observable showTags = true;
  @observable formulaIndex = 0;

  constructor() {
    let p = new Post();
    p.samplePost();
    this.post = p;
  }

  back() {
    if (this.myBack) {
      this.myBack();
    } else {
      this.navigator.pop({
        animated: true,
      });
    }
  }


  @computed get numberOfTags() {
    return this.selectedPicture.tags.length;
  }

  @computed get serviceTags() {
    let services = this.selectedPicture.tags.filter(e => e.type == 'service');
    return services;
  }

  @computed get tagImage() {
    if (this.showTags) {
      return require('img/feed_white_tags_on.png');
    } else {
      return require('img/feed_white_tags_off.png');
    }
  }

  @action selectIndex(index) {
    this.selectedIndex = index;
  }

  selectTag(tag) {

    if (tag.type == 'service') {
      let serviceTags =  this.serviceTags;

      for (let i = 0; i < serviceTags.length; i++) {
        if (serviceTags[i].key == tag.key) {
          this.swiper.setState({index: i});
          this.scrollView.scrollTo({y: this.colorFormulaPosY});
        }
      }
    } else if (tag.type == 'hashtag') {
      ActionSheetIOS.showActionSheetWithOptions({
        title: `#${tag.hashtag}`,
        options: [`See all posts tagged #${tag.hashtag}`, 'Cancel'],
        cancelButtonIndex: 1,
      },
        (buttonIndex) => {
          if (buttonIndex == 0) {
            TagPostStore.jump(
              tag.hashtag,
              `#${tag.hashtag}`,
              this.navigator,
            );
          }
        });
    } else if (tag.type == 'link') {

      let options = ['Open website', 'Cancel'];

      if (tag.hashtag) {
        options.unshift(`See all posts tagged #${tag.hashtag}`);
      }


      ActionSheetIOS.showActionSheetWithOptions({
        title: `${tag.name}`,
        options: options,
        cancelButtonIndex: options.length - 1,
      },
        (buttonIndex) => {
          if (options[buttonIndex] == 'Open website') {
            Linking.canOpenURL(tag.linkUrl).then(supported => {
              if (supported) {
                Linking.openURL(tag.linkUrl);
              } else {
                console.log('Don\'t know how to open URI: ' + this.props.url);
              }
            });
          } else if (options[buttonIndex].indexOf('tagged') > -1) {
            TagPostStore.jump(
              tag.hashtag,
              `#${tag.hashtag}`,
              this.navigator
            );
          }
        });
    }
  }

  @computed get selectedPicture() {
    return this.post.pictures[this.selectedIndex];
  }

}

class PostDetailStore {
  @observable stack = [];

  jump(showTags, post, navigator) {
    let postStore = new PostDetailsModel();
    postStore.navigator = navigator;
    postStore.showTags = showTags;
    postStore.post = post;
    postStore.myBack = () => {
      navigator.toggleTabs({
        to: 'shown',
      });
      navigator.pop({
        animated: true,
      })
      this.stack.pop();
    }
    this.stack.push(postStore);
    navigator.push({
      screen: 'hairfolio.PostDetails',
      navigatorStyle: NavigatorStyles.tab,
      title: 'Post Details',
    })
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

const store = new PostDetailStore();

export default store;

