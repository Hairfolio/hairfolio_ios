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


import Service from 'hairfolio/src/services/index.js'
import FavoriteStore from 'stores/FavoriteStore.js'

import ServiceBackend from 'backend/ServiceBackend.js'

import Picture from 'stores/Picture.js'

class GetObj {
  constructor(obj) {
    this.data = obj;
  }

  get(index) {
    return this.data[index];
  }
}

export default class User {
  @observable profilePicture;
  @observable name;

  async init(data) {
    if (!data) {
      return;
    }

    this.id = data.id;

    if (data.account_type == 'salon' || data.account_type == 'brand') {
      this.name = `${data.business_name}`;
    } else {
      this.name = `${data.first_name} ${data.last_name}`;
    }

    let environment = await EnvironmentStore.get();

    let picObj = {uri: utils.getUserProfilePicURI(new GetObj(data), new GetObj(environment))};

    console.log('uri', utils.getUserProfilePicURI(new GetObj(data), new GetObj(environment)));

    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );
  }

  sample() {
    let picObj = require('img/feed_example_profile.png');
    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );

    this.name = 'First Last name';
  }
}
