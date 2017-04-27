// file that includes all the standard things i generally load in one file
import React, { Component } from 'react'
import _ from 'lodash';
import {observer} from 'mobx-react/native'
import {observable, computed, action} from 'mobx';
import autobind from 'autobind-decorator'
import {v4} from 'uuid';
import {h, FONTS, COLORS} from 'Hairfolio/src/style.js'
import {Alert, PickerIOS, Linking, Animated, Picker, Dimensions, Modal, StatusBar, ActivityIndicator, ListView, WebView, AlertIOS, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, ActionSheetIOS, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import Service from 'Hairfolio/src/services/index.js'

let getUserId = () => Service.fetch.store.getState().user.data.get('id');

let moment = require('moment');

moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s:  'seconds',
    ss: '%ss',
    m:  'a minute',
    mm: '%dm',
    h:  'an hour',
    hh: '%dh',
    d:  'a day',
    dd: '%dd',
    M:  'a month',
    MM: '%dM',
    y:  'a year',
    yy: '%dY'
  }
});

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

let s = (el) => (a) => el = a;

let jpg = (url) => url.substr(0, url.lastIndexOf('.')) + '.jpg';

export {
  _, // lodash
  observer, // mobx
  h,
  s,
  FONTS,
  autobind,
  React, // react
  Component,
  AlertIOS,
  Alert,
  COLORS,
  windowWidth,
  windowHeight,
  moment,
  v4,
  // mobx
  observable, computed, action,
  Linking,
  // react-native components
  ActionSheetIOS, PickerIOS, ActivityIndicator, WebView, Picker, Animated, Modal, StatusBar, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions,
  getUserId,
  ListView,
  jpg
};

