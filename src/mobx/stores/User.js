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
} from 'Hairfolio/src/helpers.js';

import utils from 'Hairfolio/src/utils.js'
import EnvironmentStore from 'stores/EnvironmentStore.js'


import FavoriteStore from 'stores/FavoriteStore.js'

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

    if (data.account_type == 'owner' && data.salon) {
      if (data.solon_name) {
        this.name = data.salon_name;
      } else if (data.salon) {
        this.name = data.salon.name;
      } else {
        this.name = '????';
      }
    } else if (data.account_type == 'ambassador') {
      if (data.brand_name) {
        this.name = data.brand_name;
      } else if (data.brand) {
        this.name = data.brand.name;
      } else {
        this.name = '????';
      }
    } else {
      this.name = `${data.first_name} ${data.last_name}`;
    }

    let environment = await EnvironmentStore.loadEnv();

    let picObj = {uri: utils.getUserProfilePicURI(new GetObj(data), new GetObj(environment))};

    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );
  }

  sample(name = 'First Last Name') {
    let picObj = require('img/feed_example_profile.png');
    this.profilePicture = new Picture(
      picObj,
      picObj,
      null
    );

    this.name = name;
  }
}
