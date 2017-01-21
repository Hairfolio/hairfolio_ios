import {
  _, // lodash
  v4,
  observer, // mobx
  observable,
  computed,
  moment,
  action,
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import utils from 'hairfolio/src/utils.js'
import EnvironmentStore from 'stores/EnvironmentStore.js'

import User from 'stores/User.js';


import Service from 'hairfolio/src/services/index.js'
import FavoriteStore from 'stores/FavoriteStore.js'

import ServiceBackend from 'backend/ServiceBackend.js'

import Picture from 'stores/Picture.js'

export default class Post {
  @observable description
  @observable pictures
  @observable currentIndex = 0
  @observable key = v4()
  @observable creator
  @observable createdTime;
  @observable hasStarred;
  @observable starNumber;
  @observable numberOfComments;
  @observable showStar;
  @observable showSave;

  constructor() {

  }

  async init(data) {
    if (!data) {
      return;
    }

    this.id = data.id;
    this.description = data.description;
    this.pictures = [];

    this.starNumber = data.likes_count;
    this.numberOfComments = data.comments_count;

    this.hasStarred = data.liked_by_me;

    let user = new User();

    // user.sample();
    await user.init(data.user);
    this.creator = user;

    this.createdTime = moment(data.created_at);

    for (let pic of data.photos) {

      //let url = pic.url.split('upload');
      // let newUrl = `${url[0]}upload/h_${2 * windowWidth}${url[1]}`;


      let picObj = {uri: pic.asset_url};
      let picture = new Picture(
        picObj,
        picObj,
        null
      );

      if (pic.video_url) {
        picture.videoUrl = pic.video_url;
      }

      for (let item of pic.labels) {

        if (item.formulas.length > 0) {
          console.log('label service', item.formulas[0]);
          picture.addServiceTag(item.position_left, item.position_top, item.formulas[0]);
        } else if (item.url != null) {
          console.log('label link', item.url);
          picture.addLinkTag(item.position_left, item.position_top, item);

        } else {
          console.log('label tag');
          picture.addHashTag(item.position_left, item.position_top, item.tag.name);
        }

        if (item.tag) {
          picture.tags[picture.tags.length - 1].tagId = item.tag.id;
        }

        if (item.id) {
          picture.tags[picture.tags.length - 1].id = item.id;
        }

      }

      this.pictures.push(picture);
    }

    return this;
  }


  @computed get currentImage() {
    return this.pictures[this.currentIndex];
  }

  @computed get numberOfTags() {
    let counter = 0;

    for (let picture of this.pictures) {
      counter += picture.tags.length;
    }

    return counter;
  }

  @computed get topHashTag() {
    let help = this.hashTags;
    if (help.length > 0) {
      return '#' + help[0].hashtag;
    } else {
      return '';
    }
  }

  @computed get hashTags() {
    let hashTags = [];
    for (let pic of this.pictures) {
      for (let h of pic.tags) {
        if (h.hashtag) {
          hashTags.push(h);
        }
      }
    }
    return hashTags;
  }

  @computed get starImageSource() {
    if (this.hasStarred) {
      return require('img/feed_star_on.png');
    } else {
      return require('img/feed_star_off.png');
    }
  }


  @computed get starImageSourceWhite() {
    if (this.hasStarred) {
      return require('img/feed_white_star_on.png');
    } else {
      return require('img/feed_white_star_off.png');
    }
  }

  @computed get photoInfo() {
    return `${this.currentIndex + 1} of ${this.pictures.length}`;
  }

  getTimeDifference() {
    return this.createdTime.toNow(true);
  }

  samplePost(postNumber = 0) {
    this.description = 'This is a test description that should go to at least two lines so we can test it properly.';
    this.pictures = [];

    this.starNumber = 428;
    this.numberOfComments = 52;
    this.hasStarred = false;


    let user = new User();
    user.sample();
    this.creator = user;

    this.createdTime = moment().subtract({minutes: 2});


    if (postNumber == 1) {
      let pic = require('img/feed_example4.png');

      this.pictures.push(
        new Picture(
          pic,
          pic,
          null
        )
      );
    } else if (postNumber == 2) {
      let pic = require('img/feed_example5.png');

      this.pictures.push(
        new Picture(
          pic,
          pic,
          null
        )
      );
    } else if (postNumber == 3) {

      let pic = require('img/feed_example6.png');

      this.pictures.push(
        new Picture(
          pic,
          pic,
          null
        )
      );

    }

    if (postNumber != 0) {
      return;
    }


    let pictureObj2 = require('img/feed_example1.png');
    let pictureObj3 = require('img/feed_example2.png');
    let pictureObj4 = require('img/feed_example3.png');


    for (let obj of [pictureObj2, pictureObj3, pictureObj4]) {
      this.pictures.push(
        new Picture(
          obj,
          obj,
          null
        )
      );
    }

    this.pictures[0].addHashTag(60, 50, 'beautiful');
    this.pictures[0].addHashTag(300, 250, 'test');

    this.pictures[0].addHashTag(100, 60, 'life');

    this.pictures[1].addLinkTag(80, 200,
      {
        linkUrl: 'http://www.google.com',
        name: 'My Link',
        hashtag: {name: 'test'}
      }
    );

    this.pictures[0].addServiceTag(250, 100,
      {
        service_id: 4,
        line_id: 5,
        service_name: 'Bleach',
        brand_name: 'Loreal',
        line_name: 'Name',
        unit: 'g',
        post_item_tag_colors: [
          {
            color: {
              id: 3,
              code: 'A3',
              hex: '352423',
              start_hex: '352423',
              end_hex: '975fa4',
            },
            amount: 23
          },
          {
            color: {
              id: 10,
              code: 'B3',
              hex: '7ba3ce',
              start_hex: '7ba3ce',
              end_hex: '080c4f',
            },
            amount: 20
          }
        ],
        developer_volume: 50,
        developer_amount: 15,
        developer_time: 20
      }
    );

    this.pictures[0].addServiceTag(80, 250,
      {
        service_id: 4,
        line_id: 5,
        service_name: 'Hair',
        brand_name: 'Brand 2',
        line_name: 'Color name',
        unit: 'oz',
        post_item_tag_colors: [
          {
            color: {
              id: 3,
              code: 'A3',
              hex: '352423',
              start_hex: '352423',
              end_hex: '975fa4',
            },
            amount: 23
          },
          {
            color: {
              id: 10,
              code: 'B3',
              hex: '7ba3ce',
              start_hex: '7ba3ce',
              end_hex: '080c4f',
            },
            amount: 20
          }
        ],
        developer_volume: 10,
        developer_amount: 3,
        developer_time: 20
      }
    );

  }

  async starPost() {
    this.showStar = true;

    let hasStarred = this.hasStarred;

    this.hasStarred = !this.hasStarred;

    setTimeout(() => {
      this.showStar = false;
    }, 1500);

    if (hasStarred) {
      this.starNumber--;
      let starResult = await ServiceBackend.delete(`/posts/${this.id}/likes`);
      console.log('starResult', starResult);
    } else {
      this.starNumber++;
      let starResult = await ServiceBackend.post(`/posts/${this.id}/likes`);
      console.log('starResult', starResult);
    }

    FavoriteStore.load();
  }

  save() {
  }

  async savePost() {
    this.showSave = true;

    // get inspiration hairfolio
    let hairfolios = (await ServiceBackend.get('/folios')).folios;

    let inspiration = hairfolios.filter(e => e.name == 'Inspiration');

    let inspirationId;
    let postIds;

    console.log('inspiration length', inspiration.length);

    if (inspiration.length == 0) {
      console.log('other case');
      let res = await ServiceBackend.post('folios', {folio: {name: 'Inspiration'}});
      inspirationId = res.folio.id;
      postIds = res.folio.posts.map(e => e.id);
    } else {
      inspirationId = inspiration[0].id;
      postIds = inspiration[0].posts.map(e => e.id);
    }

    postIds.push(this.id);


    let pinRes = await ServiceBackend.put(`folios/${inspirationId}`, {folio: {post_ids: postIds}});


    this.showSave = false;
  }
}
