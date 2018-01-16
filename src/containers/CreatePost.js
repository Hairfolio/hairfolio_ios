import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  ImageEditor,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import {COLORS, FONTS, h, SCALE} from 'Hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import CreatePostStore from '../mobx/stores/CreatePostStore';

import Camera from 'react-native-camera';

import {CameraKitCamera} from 'react-native-camera-kit'

import SlimHeader from '../components/SlimHeader';
import LibraryListView from '../components/post/LibraryListView'

import Recorder from 'react-native-screcorder'

window.myRecorder = Recorder;

const VideoRecorder = observer(({isOpen}) => {

  if (!isOpen) {
    return (
      <View
        style={{backgroundColor: 'transparent', height: Dimensions.get('window').width, width: Dimensions.get('window').width, }}
      />
    );
  }

  let windowWidth = Dimensions.get('window').width;

  return (
    <Recorder
      ref={rec => window.recorder = rec}
      config={{
        flashMode: Recorder.constants.SCFlashModeOff,
        video: {
          enabled: true,
          format: 'MPEG4',
          bitrate: 2000000,
          timescale: 1
        }
      }}
      device='back'
      onNewSegment={(segment) => {
        // window.recorder.removeAllSegments()?
        _.last(window.navigators).jumpTo(gallery)
        CreatePostStore.loadGallery = false;

        CreatePostStore.lastTakenPicture = {
          path: segment.thumbnail,
          videoUrl: segment.url,
        };
        CreatePostStore.addTakenVideoToGallery()
      }}
      style={{
        width: windowWidth,
        height: windowWidth
      }}>
    </Recorder>
  );
});

const CameraView = observer(({isOpen}) => {

  if (!isOpen) {
    return (
      <View
        style={{backgroundColor: 'transparent', height: Dimensions.get('window').width, width: Dimensions.get('window').width, }}
      />
    );
  }


  return (
    <View>
      <CameraKitCamera
        ref={(cam) => {
          window.camera = cam;
        }}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width
        }}
        cameraOptions={{
          flashMode: 'off',             // on/off/auto(default)
          focusMode: 'on',               // off/on(default)
          zoomMode: 'on',                // off/on(default)
          ratioOverlay: '1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
          ratioOverlayColor: '#00000077' // optional
        }}
      />
    </View>
  );
});

const LibraryPreview = observer(({store}) => {

  let windowWidth = Dimensions.get('window').width;

  if (store.selectedLibraryPicture != null) {
    return (
      <View
        style={{height: Dimensions.get('window').width, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image
          style={{height: windowWidth, width: windowWidth}}
          source={{uri: store.selectedLibraryPicture.uri}}
        />
      </View>
    );

  }

  return (
    <View
      style={{height: Dimensions.get('window').width, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{fontSize: 30, textAlign: 'center'}}>Select a picture</Text>
    </View>
  );

});

const Footer = ({selectedMode, onSelect}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: SCALE.h(25), paddingHorizontal: SCALE.h(25)}}>
      <TouchableWithoutFeedback
        onPress={() => onSelect('Library')}
      >
        <View style={{flex: 1}}>
          <Text style={{
            fontSize: SCALE.h(34),
            fontFamily: selectedMode === 'Library' ? FONTS.SF_BOLD : FONTS.SF_REGULAR}}>
            Library</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => onSelect('Photo')}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: SCALE.h(34),
              fontFamily: selectedMode === 'Photo' ? FONTS.SF_BOLD : FONTS.SF_REGULAR,
              textAlign: 'center',
              flex: 1
            }}>Photo</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => { onSelect('Video')}}>
        <View style={{flex: 1}}>
          <Text style={{
            fontSize: SCALE.h(34),
            fontFamily: selectedMode === 'Video' ? FONTS.SF_BOLD : FONTS.SF_REGULAR,
            textAlign: 'right',
            flex: 1
          }}>Video</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
  );
};


const LibraryHeader = observer(({onLeft, onRight, onTitle, store}) => {
  return (
    <View
      style={{
        height: SCALE.h(88),
        paddingHorizontal: SCALE.h(25),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: h(1),
        borderColor: '#D3D3D3'
      }}
    >
      <TouchableOpacity
        onPress={onLeft}
        style={{flex: 1}}>
        <Text style={{
          fontSize: SCALE.h(34),
          fontFamily: FONTS.SF_REGULAR}} >
          Cancel
        </Text>
      </TouchableOpacity>
      <View style={{flex: 2, }}>
        <TouchableWithoutFeedback onPress={onTitle}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: h(34)}}> {store.libraryTitle} </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: h(26), color: '#7E7E7E'}}>{store.groupName}</Text>
              <Image
                style={{marginLeft: h(6), marginTop: 2}}
                source={require('../../resources/img/post_down_arrow.png')}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
        <TouchableOpacity
          onPress={onRight}
          style={{flex: 1}}>
          <Text style={{
            fontSize: SCALE.h(34),
            textAlign: 'right',
            fontFamily: FONTS.SF_REGULAR}} >
            Next
          </Text>
        </TouchableOpacity>
      </View>
  );
});

@observer
@autobind
export default class CreatePost extends PureComponent {
  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  capture() {

    _.last(this.context.navigators).jumpTo(gallery)
    StatusBar.setHidden(false);

    CreatePostStore.loadGallery = true;

    window.camera.capture()
      .then((data) => {
        CreatePostStore.loadGallery = false;
        CreatePostStore.lastTakenPicture = data;
        CreatePostStore.addTakenPictureToGallery()
      })
      .catch(err => { alert('error'); console.error(err); CreatePostStore.loadGallery = false; });
  }

  startRecording() {
    CreatePostStore.startRecording();
  }

  stopRecording() {
    CreatePostStore.stopRecording();

    _.last(window.navigators).jumpTo(gallery)
    CreatePostStore.loadGallery = true;

  }

  render() {
    window.createPost = this;

    let middleElement = (
      <TouchableOpacity key='photo' onPress={() => this.capture()}>
        <Image
          source={require('../../resources/img/post_capture.png')}
        />
      </TouchableOpacity>
    );

    let cancel = () => {
      if (!CreatePostStore.gallery.wasOpened) {
        CreatePostStore.reset();
        window.nav = this.context.navigators;
        _.first(this.context.navigators).jumpTo(appStack);
      } else {
        _.last(this.context.navigators).jumpTo(gallery)
        StatusBar.setHidden(false);
      }
    };

    let header = (
      <SlimHeader
        onLeft={cancel}
        leftText='Cancel'
        title={CreatePostStore.title}/>
    );

    let mainView = (
      <View>
        <CameraView isOpen={CreatePostStore.isOpen} />
        <TouchableOpacity onPress={() => CreatePostStore.switchCameraFlashMode()} style={{ position: 'absolute', right: 0, bottom: 0, padding: SCALE.h(40)}}>
          <Image
            style={{height: 35, width: 35}}
            source={CreatePostStore.flashIconSource} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => CreatePostStore.switchCameraType()} style={{ position: 'absolute', left: 0, bottom: 0, padding: SCALE.h(40)}}>
          <Image
            source={require('img/post_camera_swift.png')} />
        </TouchableOpacity>
      </View>
    );

    if (CreatePostStore.inputMethod === 'Library') {
      middleElement = (
        <LibraryListView store={CreatePostStore} />
      );

      mainView = (<LibraryPreview store={CreatePostStore} />);

      header = (
        <LibraryHeader
          onTitle={() => { window.navigators = this.context.navigators; _.last(this.context.navigators).jumpTo(albumPage) }}
          store={CreatePostStore}
          onLeft={cancel}
          onRight={() => {
            if (CreatePostStore.selectedLibraryPicture == null) {
              alert('Select at least one picture');
            } else {
              CreatePostStore.addLibraryPicturesToGallary();
              _.last(this.context.navigators).jumpTo(gallery)
              StatusBar.setHidden(false);
            }
          }}
       />
      );
    } else if (CreatePostStore.inputMethod == 'Video') {
      mainView = (
        <View>
          <VideoRecorder isOpen={CreatePostStore.isOpen} />
          {/*
          <TouchableOpacity onPress={() => CreatePostStore.switchCameraFlashMode()} style={{ position: 'absolute', right: 0, bottom: 0, padding: SCALE.h(40)}}>
            <Image
              style={{height: 35, width: 35}}
              source={CreatePostStore.flashIconSource} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => CreatePostStore.switchCameraType()} style={{ position: 'absolute', left: 0, bottom: 0, padding: SCALE.h(40)}}>
            <Image
              source={require('img/post_camera_swift.png')} />
          </TouchableOpacity>
          */
          }
        </View>
      );

      if (CreatePostStore.isRecording) {
        middleElement = (
          <TouchableOpacity key='video-record-on' onPress={() => this.stopRecording()}>
            <Image
              source={require('img/record_on.png')}
            />
          </TouchableOpacity>
        );
      } else {
        middleElement = (
          <TouchableOpacity  key='video-record-off' onPress={() => this.startRecording()}>
            <Image
              source={require('img/record_off.png')}
            />
          </TouchableOpacity>
        );
      }


    }

    return (<NavigationSetting
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}
      navigationBarStyle= {{
        backgroundColor: 'red'
      }}
      titleStyle={{
        color: 'black'
      }}
    >
      <View style={{
        flex: 1
      }}>
      {header}
      {mainView}


        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
        {middleElement}
                  </View>
        <Footer
          onSelect={ (value) => { CreatePostStore.changeInputMethod(value) } }
        selectedMode={CreatePostStore.inputMethod} />

          </View>
        </NavigationSetting>);
  }
};
