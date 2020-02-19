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
<<<<<<< HEAD
import { COLORS, showLog } from '../helpers';
=======


import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MyPicker from './MyPicker';

import {Dimensions, NativeModules} from 'react-native';

import ReactNative from 'react-native';
>>>>>>> 54984317c885a1c4abe0547d63d8f2b704b9f556

const RCTUIManager = NativeModules.UIManager;
const ImageFilter = NativeModules.ImageFilter;

import ServiceBox from './post/ServiceBox';

const PlayButton = observer(({myWidth, playPauseAction}) => {
  return (
    <TouchableWithoutFeedback onPress={ playPauseAction } >
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
      isPaused: true,
    };
  }

  playPauseAction = () => {
    this.setState({
      isPaused: !this.state.isPaused,
    })
  }

  render = () => {
    if (this.pic == null) {
      return <View />;
    }
    return (
<<<<<<< HEAD
      <TouchableWithoutFeedback 
        onPress={
        (e) => {
          post = this.post;
          showLog("VIDEO PREVIEW JS ==> "+JSON.stringify(this.post))
          let data = e.touchHistory.touchBank[1];
          let timeDiff = data.currentTimeStamp - data.previousTimeStamp;
          
          let currentClickTime = (new Date()).getTime();

          if (post.lastClickTime) {
            let diff = currentClickTime - post.lastClickTime;


            if(this.state.clearId){
              clearTimeout(this.state.clearId)  
            }
            var clearId = setTimeout(() => {
               if (diff < 200) {
              post.doubleClick = true;
              post.starPost();
            } else {
              post.doubleClick = false;
              this.playPauseAction();
            }
              }, 350);
            this.setState({ clearId: clearId});
          }
          this.post.lastClickTime = currentClickTime;          
        }}     
      onLongPress={(e) => {
        this.post.savePost();
      }}>
=======
      <TouchableWithoutFeedback onPress={this.playPauseAction}>
>>>>>>> 54984317c885a1c4abe0547d63d8f2b704b9f556
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
              paused={this.state.isPaused}
              repeat={true}
              resizeMode="contain"
              onEnd={this.playPauseAction}
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
