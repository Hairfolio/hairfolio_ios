import Picture from 'stores/Picture.js'

import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import ReactNative from 'react-native';

import ServiceBackend from 'backend/ServiceBackend.js'
var RCTUIManager = require('NativeModules').UIManager;


class ContactDetailsStore {
  @observable mode = 'view';

  @observable isUploadingPicture;

  @observable picture;

  // general
  @observable firstName= 'Alan';
  @observable lastName = 'Williams';
  @observable companyName;

  // phone
  @observable phoneMobile;
  @observable phoneHome;
  @observable phoneWork;

  // email
  @observable emailPrimary;
  @observable emailSecondary;

  // address
  @observable addressStreet1;
  @observable addressStreet2;
  @observable addressPostCode;
  @observable addressPostCode;
  @observable addressCountry;


  rightHeaderClick() {
    if (this.mode == 'view') {
      this.mode = 'edit';
      // TODO save previous values
    } else if (this.mode == 'edit') {
      this.mode = 'view';
      //TODO save edits in backend
    } else {
      // TODO create new contact
      this.myBack();
    }
  }
  leftHeaderClick() {
    if (this.mode == 'edit') {
      this.mode = 'view';
      // TODO reset all the value
    } else {
      this.myBack();
    }
  }

  @computed get rightHeaderText() {
    if (this.mode == 'view') {
      return 'Edit';
    } else {
      return 'Done';
    }
  }

  @computed get title() {
    if (this.mode == 'new') {
      return 'New Contact';
    } else {
      return this.firstName + ' ' + this.lastName;
    }
  }

  @computed get profileImage() {

    if (this.picture == null) {
      return require('img/contact_camera.png');
    } else {
      return this.picture.getSource(120);
    }
  }

  async sendPicture(response) {

    this.isUploadingPicture = true;

    let pic = {uri: response.uri, isStatic: true};
    let picture = new Picture(
      pic,
      pic,
      null
    );

    // send to cloudinary
    let res = await picture.toJSON();

    console.log('cloud 2', res);

    pic = {uri: res.url, isStatic: true};

    this.picture = new Picture(
      pic,
      pic,
      null
    );

    this.isUploadingPicture = false;
  }

  scrollToElement(reactNode) {
    RCTUIManager.measure(ReactNative.findNodeHandle(reactNode), (x, y, width, height, pageX, pageY) => {
      RCTUIManager.measure(this.scrollView.getInnerViewNode(), (x2, y2, width2, height2, pageX2, pageY2) => {
        console.log('pageY', pageY, pageY2, height, height2);
        // currentPos: 64
        var currentScroll = 64 - pageY2;
        var differenceY = -pageY - 240 + (windowHeight - 20 - h(88));

        console.log(differenceY);
        if (currentScroll - differenceY > 0) {
          this.scrollView.scrollTo({y: currentScroll - differenceY});
        }
      });
    });
  }

}

const store = new ContactDetailsStore();

export default store;

