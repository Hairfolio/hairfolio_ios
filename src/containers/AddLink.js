import {
  _, // lodash
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
  WebView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'

import {appStack, createPost, onPress, postFilter, albumPage, addServiceTwo, gallery} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

import MyPicker from 'components/MyPicker.js'

import AddLinkStore from 'stores/AddLinkStore.js'


import ReactNative from 'react-native';


@observer
@autobind
export default class AddLink extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    let store = AddLinkStore;


    return (
        <View style={{paddingTop: 20, flex: 1, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Back'
            onLeft={() => {
            }}
            title='Add Link'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText={'Done'}
            onRight={() => {
            }}
          />
        </View>
    );
  }
}
