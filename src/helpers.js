// file that includes all the standard things i generally load in one file
import React, { Component } from 'react'
import _ from 'lodash';
import {observer} from 'mobx-react/native'
import autobind from 'autobind-decorator'
import {v4} from 'uuid';
import {h, FONTS} from 'hairfolio/src/style.js'
import {PickerIOS, Animated, Picker, Dimensions, Modal, StatusBar, ActivityIndicator, WebView, AlertIOS, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

let s = (el) => (a) => el = a;

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
  windowWidth,
  windowHeight,
  v4,
  // react-native components
  PickerIOS, ActivityIndicator, WebView, Picker, Animated, Modal, StatusBar, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions
};

