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
} from 'Hairfolio/src/helpers';

import SlimHeader from './SlimHeader'
import AlbumStore from '../mobx/stores/AlbumStore';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import AddServiceStore from '../mobx/stores/AddServiceStore';

import ShareStore from '../mobx/stores/ShareStore';

import ServiceBackend from '../backend/ServiceBackend';
import LoadingScreen from './LoadingScreen';
import Video from 'react-native-video';


import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MyPicker from './MyPicker';

import {Dimensions, NativeModules} from 'react-native';

import ReactNative from 'react-native';

const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;

import ServiceBox from './post/ServiceBox';

const PlayButton = observer(({myWidth, pic}) => {

  if (pic.isPlaying && !pic.isPaused) {
    return <View />;
  }

  return (

    <TouchableWithoutFeedback
      onPress={
        () => {
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
            height: myWidth * (4/3),
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
              height: windowHeight * (4/3),
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
          height: myWidth * (4/3)
        }}
      >
      <Image
        style={{
          height: myWidth * (4/3),
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
