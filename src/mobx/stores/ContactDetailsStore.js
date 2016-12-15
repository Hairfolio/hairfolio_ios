import Picture from 'stores/Picture.js'

import Communications from 'react-native-communications';

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
  @observable firstName = 'Alan';
  @observable lastName = 'Williams';
  @observable companyName = 'My Company';

  // phone
  @observable phoneMobile = '6156619954';
  @observable phoneHome = '1234567891';
  @observable phoneWork = '0123456789';

  // email
  @observable emailPrimary = 'test@gmail.com';
  @observable emailSecondary = 'test2@gmail.com';

  // address
  @observable addressStreet1 = '214 Overlook Circle';
  @observable addressState = 'California';
  @observable addressPostCode = '37027';
  @observable addressCity = 'Brentwood' ;
  @observable addressCountry = 'United States';

  @computed get hasPrimaryEmail() {
    return this.emailPrimary.length > 0;
  }

  @computed get hasAddress() {
    return this.addressStreet1.length > 0;
  }

  @computed get hasSecondaryEmail() {
    return this.emailSecondary.length > 0;
  }


  @computed get hasMobilePhoneNumber() {
    return this.phoneMobile && this.phoneMobile.length > 0;
  }

  @computed get hasHomePhoneNumber() {
    return this.phoneHome && this.phoneHome.length > 0;
  }

  @computed get hasWorkPhoneNumber() {
    return this.phoneWork && this.phoneWork.length > 0;
  }


  constructor() {
    this.sample();
  }

  reset() {
    this.mode = 'new';
    this.picture = null;
    this.firstName = '';
    this.lastName = '';
    this.companyName = '';
    this.phoneMobile = '';
    this.phoneHome = '';
    this.phoneWork = '';
    this.emailPrimary = '';
    this.emailSecondary = '';
    this.addressStreet1 = '';
    this.addressState = '';
    this.addressPostCode = '';
    this.addressCity = '';
    this.addressCountry = '';
  }


  init(store) {
    let data = store.data;
    this.mode = 'view';

    let conv = (el) => {
      return el ? el : '';
    }

    this.firstName = data.first_name;
    this.lastName = data.last_name;

    if (data.asset_url) {
      let pic = {uri: data.asset_url, isStatic: true};
      this.picture = new Picture(
        pic,
        pic,
        null
      );

    } else {
      this.picture = null;
    }

    this.companyName = conv(data.company);

    // TODO phone
    this.phoneMobile = '6156619954';
    this.phoneHome = '1234567891';
    this.phoneWork = '0123456789';


    this.emailPrimary = '';
    this.emailSecondary = '';

    for (let e of data.emails) {
      if (e.email_type == 'primary') {
        this.emailPrimary = e.email;
      } else if (e.email_type == 'secondary') {
        this.emailSecondary = e.email;
      }
    }

    this.addressStreet1 = conv(data.address);
    this.addressState = conv(data.state);
    this.addressPostCode = conv(data.zipcode);
    this.addressCity = conv(data.city);
    this.addressCountry = conv(data.country);
  }

  sample() {
    this.mode = 'view';
    let picObj = require('img/feed_example_profile.png');
    this.picture = new Picture(
      picObj,
      picObj,
      null
    );
    this.firstName = 'Alice';
    this.lastName = 'Williams';
    this.companyName = 'My Company';
    this.phoneMobile = '6156619954';
    this.phoneHome = '1234567891';
    this.phoneWork = '0123456789';
    this.emailPrimary = 'test@gmail.com';
    this.emailSecondary = 'test2@gmail.com';
    this.addressStreet1 = '214 Overlook Circle';
    this.addressState = 'Suite 220';
    this.addressPostCode = '37027';
    this.addressCity = 'Brentwood';
    this.addressCountry = 'United States';
  }


  call(number) {
    Communications.phonecall(number, true);
  }

  message(number) {
    Communications.text(number);
    // alert('messsage:  ' + number);
  }

  sendEmail(email) {
    Communications.email([email], null, null, '', '')
  }

  formatNumber(str) {
    return '(' + str.substr(0, 3) + ') ' + str.substr(3, 3) + '-' + str.substr(6, 4);
  }

  async rightHeaderClick() {
    if (this.mode == 'view') {
      this.mode = 'edit';

      this.oldValues = {
        picture: this.picture,
        firstName: this.firstName,
        lastName: this.lastName,
        companyName: this.companyName,
        phoneMobile: this.phoneMobile,
        phoneHome: this.phoneHome,
        phoneWork: this.phoneWork,
        emailPrimary: this.emailPrimary,
        emailSecondary: this.emailSecondary,
        addressStreet1: this.addressStreet1,
        addressState: this.addressState,
        addressPostCode: this.addressPostCode,
        addressCity: this.addressCity,
        addressCountry: this.addressCountry
      };

    } else if (this.mode == 'edit') {
      this.mode = 'view';
      // TODO save in backend
    } else { //  created new contact

      if (this.firstName.length == 0 || this.lastName.length == 0) {
        alert('Please Fill in a first and lastName');
        return;
      }


      let data = {};

      let add = (a, b) => {
        if (this[a] != null && this[a].length > 0) { data[b] = this[a]};
      }

      add('firstName', 'first_name');
      add('lastName', 'last_name');
      add('companyName', 'company');
      add('addressStreet1', 'address');
      add('addressCity', 'city');
      add('addressPostCode', 'zipcode');
      add('addressState', 'state');
      add('addressCountry', 'country');


      let emails_attributes = [];

      if (this.emailPrimary && this.emailPrimary.length > 0) {
        emails_attributes.push({
          email_type: 'primary',
          email: this.emailPrimary
        });
      }

      if (this.emailSecondary && this.emailSecondary.length > 0) {
        emails_attributes.push({
          email_type: 'secondary',
          email: this.emailSecondary
        });
      }

      data.emails_attributes = emails_attributes;

      console.log('data', data);

      data.phones_attributes = [];

      if (this.phoneHome && this.phoneHome.length > 0) {
        data.phones_attributes.push({
          phone_type: 'home',
          number: this.phoneHome
        });
      }

      if (this.phoneMobile && this.phoneMobile.length > 0) {
        data.phones_attributes.push({
          phone_type: 'mobile',
          number: this.phoneMobile
        });
      }

      if (this.phoneWork && this.phoneWork.length > 0) {
        data.phones_attributes.push({
          phone_type: 'work',
          number: this.phoneWork
        });
      }

      if (this.picture != null) {
        data.asset_url = this.picture.source.uri;
      }

      let res = await ServiceBackend.post('contacts', {contact: data});

      console.log('contact', res);

      this.myBack();
    }
  }
  leftHeaderClick() {
    if (this.mode == 'edit') {
      this.mode = 'view';
      this.picture = this.oldValues.picture;
      this.firstName = this.oldValues.firstName;
      this.lastName = this.oldValues.lastName;
      this.companyName = this.oldValues.companyName;
      this.phoneMobile = this.oldValues.phoneMobile;
      this.phoneHome = this.oldValues.phoneHome;
      this.phoneWork = this.oldValues.phoneWork;
      this.emailPrimary = this.oldValues.emailPrimary;
      this.emailSecondary = this.oldValues.emailSecondary;
      this.addressStreet1 = this.oldValues.addressStreet1;
      this.addressState = this.oldValues.addressState;
      this.addressPostCode = this.oldValues.addressPostCode;
      this.addressCity = this.oldValues.addressCity;
      this.addressCountry = this.oldValues.addressCountr;
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
      console.log('source', this.picture.getSource(120));
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

    pic = {uri: res.asset_url, isStatic: true};

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

