import {observable, computed, action} from 'mobx';
import {CameraRoll, NativeModules} from 'react-native';
import Camera from 'react-native-camera';

import FilterStore from 'stores/FilterStore.js'
import Picture from 'stores/Picture.js'

import TagPostStore from 'stores/TagPostStore.js'

let PhotoAlbum = NativeModules.PhotoAlbum;

import {v4} from 'uuid';
import {_, Linking, moment, React, Text, ActionSheetIOS} from 'hairfolio/src/helpers';
import Post from 'stores/Post';

import * as routes from 'hairfolio/src/routes';

class PostDetailStore {
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
    window.navigators[0].jumpTo(routes.appStack);
  }


  @computed get numberOfTags() {
    return this.selectedPicture.tags.length;
  }

  @computed get serviceTags() {
    let services = this.selectedPicture.tags.filter(e => e.type == 'service');
    console.log('services', this.selectedPicture.tags);
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
          console.log('change to' + i);
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
            TagPostStore.title = `#${tag.hashtag}`;
            TagPostStore.load(tag.hashtag);
            TagPostStore.back = () =>
            window.navigators[0].jumpTo(routes.postDetails);
            window.navigators[0].jumpTo(routes.tagPosts);
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
            TagPostStore.title = `#${tag.hashtag}`;
            TagPostStore.load(tag.hashtag);
            TagPostStore.back = () =>
            window.navigators[0].jumpTo(routes.postDetails);
            window.navigators[0].jumpTo(routes.tagPosts);
          }
        });
    }
  }

  @computed get selectedPicture() {
    return this.post.pictures[this.selectedIndex];
  }
}

const store = new PostDetailStore();

export default store;

