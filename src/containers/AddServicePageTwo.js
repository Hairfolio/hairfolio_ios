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
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'

import {appStack, createPost, onPress, postFilter, albumPage, addServiceOne, addServiceThree} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

import MyPicker from 'components/MyPicker.js'


import ReactNative from 'react-native';


@observer
@autobind
export default class AddServicePageTwo extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    return (
        <View style={{paddingTop: 20, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Back'
            onLeft={() => {
              _.last(this.context.navigators).jumpTo(addServiceOne)
            }}
            title='Add Service (2/3)'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
            onRight={() => {
              _.last(this.context.navigators).jumpTo(addServiceThree)
            }}

          />

        </View>
    );
  }
}
