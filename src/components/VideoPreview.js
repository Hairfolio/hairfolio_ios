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

const PlayButton = observer(({myWidth, pic}) => {

  if (pic.isPlaying && !pic.isPaused) {
    return <View />;
  }

  return (

    <TouchableWithoutFeedback
      onPress={
        () => {
          console.log('start playing', pic.videoUrl);
          pic.isPaused = false;
          pic.isPlaying = true;
        }
      }
    >
      <Image
        style={{
          position: 'absolute',
          top: myWidth / 2 - 40,
          left: myWidth / 2 - 40,
          height: 80,
          width: 80

        }}
        source={require('img/play_button.png')}
      />
    </TouchableWithoutFeedback>
  );
});

const VideoPreview = observer(({picture, width}) => {

  let myWidth = width ? width : windowWidth;

  let pic = picture;



  if (pic == null) {
    return <View />;
  }

  if (pic.isPlaying) {
    return (
      <TouchableWithoutFeedback
        onPress={
          () => {
            pic.isPaused = !pic.isPaused;
          }
        }
      >
        <View
          style={{
            width: myWidth,
            height: myWidth,
            overflow: 'hidden'
          }}
        >
          <Video
            ref={
              v => {
                window.galleryVideo = v;
                pic.video = v;
              }
            }
            paused={pic.isPaused}
            resizeMode="stretch"
            onEnd={() => {
              pic.isPlaying = false;
            }}
            style={{
              marginTop: -(windowHeight - myWidth) / 2,
              width: myWidth,
              height: windowHeight,
              backgroundColor: 'black'
            }}
            key={pic.key}
            source={{uri: pic.videoUrl}}
          />
          <PlayButton myWidth={myWidth} pic={pic} />
        </View>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <View
        style={{
          width: myWidth,
          height: myWidth
        }}
      >
      <Image
        style={{
          height: myWidth,
          width: myWidth

        }}
        source={pic.source}
      />
      <PlayButton myWidth={myWidth} pic={pic} />
    </View>
    );
  }
});

export default VideoPreview;
