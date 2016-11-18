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

    // TODO
    this.starNumber = data.star_count;
    this.numberOfComments = data.comment_count;

    console.log('starData', data);
    this.hasStarred = data.starred_by_me;

    console.log('hasStarred', this.hasStarred);

    // TODO
    let user = new User();
    await user.init(data.user);
    this.creator = user;

    this.createdTime = moment(data.created_at);

    for (let pic of data.post_items) {

      //let url = pic.url.split('upload');
      // let newUrl = `${url[0]}upload/h_${2 * windowWidth}${url[1]}`;


      let picObj = {uri: pic.url};
      let picture = new Picture(
        picObj,
        picObj,
        null
      );

      for (let item of pic.post_item_tags) {
        if (item.type == 'hashtag') {
          picture.addHashTag(item.left, item.top, item.hashtag);
        } else if (item.type == 'link') {
          console.log('myLink', item);
          picture.addLinkTag(item.left, item.top, item);
        } else if (item.type == 'service') {
          picture.addServiceTag(item.left, item.top, item);
        }
      }

      this.pictures.push(picture);
      return;
    }

      /*
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
            id: 3,
            code: 'A3',
            hex: '352423',
            start_hex: '352423',
            end_hex: '975fa4',
            amount: 23
          },
          {
            id: 10,
            code: 'B3',
            hex: '7ba3ce',
            start_hex: '7ba3ce',
            end_hex: '080c4f',
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
            id: 8,
            code: 'A3',
            hex: '352423',
            start_hex: 'b59423',
            end_hex: '975fa4',
            amount: 23
          },
          {
            id: 10,
            code: 'B3',
            hex: '7ba3ce',
            start_hex: '2ba3ce',
            end_hex: '080c4f',
            amount: 20
          }
        ],
        developer_volume: 10,
        developer_amount: 3,
        developer_time: 20
      }
    );
    */
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
    return '#test';
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
      let starResult = await ServiceBackend.post(`/posts/${this.id}/unstar`);
      console.log('starResult', starResult);
    } else {
      this.starNumber++;
      let starResult = await ServiceBackend.post(`/posts/${this.id}/star`);
      console.log('starResult', starResult);
    }

    FavoriteStore.load();
  }

  save() {
  }

  async savePost() {
    this.showSave = true;

    // get inspiration hairfolio
    let hairfolios = await ServiceBackend.get('/hairfolios');

    let inspiration = hairfolios.filter(e => e.name == 'Inspiration');

    let inspirationId;

    console.log('inspiration length', inspiration.length);

    if (inspiration.length == 0) {
      console.log('other case');
      let res = await ServiceBackend.post('hairfolios', {name: 'Inspiration'});
      inspirationId = res.hairfolio.id;
    } else {
      inspirationId = inspiration[0].id;
    }

    // search for inspiration herfolio
    // console.log('hairfolios', hairfolios);
    // console.log('inpiration', inspiration);
    // console.log('inpiration', inspirationId);


    let pinRes = await ServiceBackend.post(`/hairfolios/${inspirationId}/pin`, {post_id: this.id});


    this.showSave = false;


  }
}
