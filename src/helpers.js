// file that includes all the standard things i generally load in one file
import React, { Component } from 'react'
import _ from 'lodash';
import {observer} from 'mobx-react/native'
import autobind from 'autobind-decorator'
import {h, FONTS} from 'hairfolio/src/style.js'
import {Dimensions, Modal, StatusBar, AlertIOS, ScrollView, Platform, View, KeyboardAvoidingView, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

export {
  _, // lodash
  observer, // mobx
  h,
  FONTS,
  autobind,
  React, // react
  Component,
  AlertIOS,
  windowWidth,
  windowHeight,
  // react-native components
  KeyboardAvoidingView, Modal, StatusBar, ScrollView, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions
};

