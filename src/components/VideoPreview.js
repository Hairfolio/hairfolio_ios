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
    this.post = props.post;
    this.state = {
      isPaused: true,
    };
  }

  playPauseAction = () => {
    this.setState({
      isPaused: !this.state.isPaused,
    })
  }

  renderOld = () => {
    if (this.pic == null) {
      return <View />;
    }
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

  render = () => {
    if (this.pic == null) {
      return <View />;
    }
    return (
      <TouchableWithoutFeedback onPress={
        (e) => {
          let data = e.touchHistory.touchBank[1];
          let timeDiff = data.currentTimeStamp - data.previousTimeStamp;

          let currentClickTime = (new Date()).getTime();

          let time = currentClickTime;

          let oneClickFunOld = () => {
            if (time == this.post.lastClickTime && !this.post.doubleClick) {
              this.post.doubleClick = true;
            } else {
              this.post.doubleClick = false;
            }
          };

          let oneClickFun = () => {
            this.post.doubleClick = false;
            /* if (time == this.post.lastClickTime) {
              if(!this.post.doubleClick){
                this.post.doubleClick = false;  
              }              
            } else {
              this.post.doubleClick = false;
            } */
          };

          if (this.post.lastClickTime) {
            let diff = currentClickTime - this.post.lastClickTime;

            if (diff <= 500) {
              setTimeout(()=>{
                this.post.doubleClick = true;
                this.post.starPost();
                this.post.lastClickTime = currentClickTime;
              },0)              
            } else {   
              setTimeout(()=>{                        
                console.log("Hii here : 142")    
                this.playPauseAction()  
                this.post.doubleClick = false; 
                this.post.lastClickTime = currentClickTime;
              },0);
            }
          } 

          // this.post.lastClickTime = currentClickTime;
        }}
      onLongPress={(e) => {
        this.post.savePost();
      }}>
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
