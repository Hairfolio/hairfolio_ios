import {
  _, // lodash
  v4,
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

import SlimHeader from 'components/SlimHeader.js'
import AlbumStore from 'stores/AlbumStore.js'
import CreatePostStore from 'stores/CreatePostStore.js'
import AddTagStore from 'stores/AddTagStore.js'
import AddServiceStore from 'stores/AddServiceStore.js'

import ShareStore from 'stores/ShareStore.js'

import ServiceBackend from 'backend/ServiceBackend.js'
import LoadingScreen from 'components/LoadingScreen.js'
import Video from 'react-native-video'


import LinearGradient from 'react-native-linear-gradient';

import {appStack, createPost, onPress, postFilter, albumPage, addServiceOne, filter, addLink, addServiceTwo, addServiceThree} from '../routes';

import * as routes from '../routes.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var RCTUIManager = require('NativeModules').UIManager;

var ImageFilter = require('NativeModules').ImageFilter;

import MyPicker from 'components/MyPicker.js'

import {Dimensions} from 'react-native';

import ReactNative from 'react-native';

import ServiceBox from 'components/post/ServiceBox.js'

import AddTagModal from 'components/post/AddTagModal.js'

const VideoPreview = observer(({picture}) => {

  let pic = picture;

  let windowWidth = Dimensions.get('window').width;

  if (pic == null) {
    return <View />;
  }

  if (pic.isPlaying) {
    return (
      <View
        style={{
          width: windowWidth,
          height: windowWidth,
          overflow: 'hidden'
        }}
      >
        <Video
          ref={
            v => {
              window.galleryVideo = v;
            }
          }
          resizeMode="stretch"
          onEnd={() => {
            pic.isPlaying = false;
          }}
          style={{
            marginTop: -(windowHeight - windowWidth) / 2,
            width: windowWidth,
            height: windowHeight,
            backgroundColor: 'black'
          }}
          key={pic.key}
          source={{uri: pic.videoUrl}}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: windowWidth,
          height: windowWidth
        }}
      >
      <Image
        style={{
          height: windowWidth,
          width: windowWidth

        }}
        source={pic.source}
      />
      <TouchableWithoutFeedback
        onPress={
          () => {
            console.log('start playing');
            pic.isPlaying = true;
          }
        }
      >
        <Image
          style={{
            position: 'absolute',
            top: windowWidth / 2 - 40,
            left: windowWidth / 2 - 40,
            height: 80,
            width: 80

          }}
          source={require('img/play_button.png')}
        />
      </TouchableWithoutFeedback>

    </View>
    );
  }
});

export default VideoPreview;
