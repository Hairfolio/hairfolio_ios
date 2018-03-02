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

const PlayButton = observer(({myWidth, playPauseAction}) => {
  return (
    <TouchableWithoutFeedback onPress={ playPauseAction() } >
      <Image source={require('img/play_button.png')} />
    </TouchableWithoutFeedback>
  );
});

@observer
class VideoPreview extends React.Component{

  constructor(props) {
    super(props)
    this.myWidth = props.width ? props.width : windowWidth;
    this.pic = props.picture;
    this.state = {
      isPaused: false,
    };
  }

  playPauseAction = () => {
    this.setState({
      isPlaying: !this.state.isPaused,
    })
  }

  render = () => {
    if (this.pic == null) {
      return <View />;
    }
    debugger;
    return (
      <TouchableWithoutFeedback onPress={this.playPauseAction}>
        <View
          style={{
            width: this.myWidth,
            height: this.myWidth * (4/3),
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        {this.state.isPaused &&
          <Image source={require('img/play_button.png')} />
        }
            <Video
              ref={
                v => {
                  window.galleryVideo = v;
                  this.pic.video = v;
                }
              }
              paused={this.state.isPaused}
              repeat={true}
              resizeMode="contain"
              onEnd={() => this.playPauseAction}
              style={{
                width: this.myWidth,
                height: windowHeight * (4/3),
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                zIndex: -1,
              }}
              key={this.pic.key}
              source={{uri: this.pic.videoUrl}}
            />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default VideoPreview;
