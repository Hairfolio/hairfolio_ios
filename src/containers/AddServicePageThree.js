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

import {appStack, createPost, onPress, postFilter, albumPage, gallery, addServiceTwo} from '../routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

import MyPicker from 'components/MyPicker.js'


import ReactNative from 'react-native';





@observer
@autobind
export default class AddServicePageThree extends Component {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {

    return (
        <View style={{paddingTop: 20, backgroundColor: 'white'}}>
          <SlimHeader
            leftText='Back'
            onLeft={() => {
              _.last(this.context.navigators).jumpTo(
                addServiceTwo
              )
            }}
            title='Add Service (3/3)'
            titleStyle={{fontFamily: FONTS.SF_MEDIUM}}
            rightText='Next'
            onRight={() => {
              _.last(this.context.navigators).jumpTo(
               gallery
              )
            }}
          />

        <ScrollView>


        </ScrollView>

        </View>
    );
  }
}
