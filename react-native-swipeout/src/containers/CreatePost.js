import autobind from 'autobind-decorator';
import { FONTS, h, SCALE } from 'Hairfolio/src/style';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, Image, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { CameraKitCamera } from 'react-native-camera-kit';
import Recorder from 'react-native-screcorder';
import NavigatorStyles from '../common/NavigatorStyles';
import LibraryListView from '../components/post/LibraryListView';
import LoadinScreen from '../components/post/LoadingScreen';
import PureComponent from '../components/PureComponent';
import SlimHeader from '../components/SlimHeader';
import { COLORS, showAlert, windowHeight, windowWidth, showLog, observable, _ } from '../helpers';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import ImageCropPicker from 'react-native-image-crop-picker';
var { height, width } = Dimensions.get('window');

window.myRecorder = Recorder;
let isPicClicked = false;
let isVideoClicked = false;

const VideoRecorder = observer(({ isOpen, navigator }) => {
  isVideoClicked = false;
  if (!isOpen) {
    return (
      <View
        style={{ backgroundColor: 'transparent', height: Dimensions.get('window').width, width: Dimensions.get('window').width, }}
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
        CreatePostStore.loadGallery = false;

        CreatePostStore.lastTakenPicture = {
          path: segment.thumbnail,
          videoUrl: segment.url,
        };
        CreatePostStore.isRecording = false;
        CreatePostStore.addTakenVideoToGallery();
      }}
      style={{
        width: windowWidth,
        // height: windowWidth * (4 / 3)
        height: (windowHeight > 800) ?  windowHeight - 200  : (windowHeight > 600) ? windowWidth * (4 / 3)+25 : windowWidth * (4 / 3),
      }}>
    </Recorder>
  );
});

const CameraView = observer(({ isOpen }) => {
  isPicClicked = false;
  if (!isOpen) {
    return (
      <View
        style={{ backgroundColor: COLORS.TRANSPARENT, height: Dimensions.get('window').width, width: Dimensions.get('window').width, }}
      />
    );
  } else if (window.camera) {
    return (
      <View>
        {window.camera}
      </View>
    );
  }
  return (
    <View>
      <CameraKitCamera
        ref={(cam) => {
          window.camera = cam;
        }}
        style={{
          width: windowWidth,
          height: (windowHeight > 800) ?  windowHeight - 200  : (windowHeight > 600) ? windowWidth * (4 / 3)+25 : windowWidth * (4 / 3),
          
        }}
        cameraOptions={{
          flashMode: 'off',             // on/off/auto(default)
          focusMode: 'on',               // off/on(default)
          zoomMode: 'on',                // off/on(default)
          ratioOverlayColor: COLORS.BLACK, // optional
          // ratioOverlay:'1:1'
        }}
      />
    </View>
  );
});

const LibraryPreview = observer(({ store }) => {

  let placeholder_icon = require('img/medium_placeholder_icon.png');
  let windowWidth = Dimensions.get('window').width;
  if (store.selectedLibraryPicture != null) {
    return (
      <View
        style={{ height: windowWidth, width: windowWidth, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image
          style={{width: windowWidth, flex: 1 }}
          defaultSource={placeholder_icon}
          source={{ uri: store.selectedLibraryPicture.uri }}
        />
      </View>
    );
  }
  return (
    <View
      style={{ height: Dimensions.get('window').width, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontSize: 30, textAlign: 'center' }}>Select a picture</Text>
    </View>
  );

});

const Footer = ({ selectedMode, onSelect }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: SCALE.h(12), paddingHorizontal: SCALE.h(25) }}>
      <TouchableWithoutFeedback
        onPress={() => onSelect('Library')}
      >
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: SCALE.h(34),
            fontFamily: selectedMode === 'Library' ? FONTS.SF_BOLD : FONTS.SF_REGULAR
          }}>
            Library</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          onSelect('Photo')
          if (CreatePostStore.isRecording) {
            CreatePostStore.stopRecording();
          }
        }}>
        <View style={{ flex: 1 }}>
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
        onPress={() => { onSelect('Video') }}>
        <View style={{ flex: 1 }}>
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

const LibraryHeader = observer(({ onLeft, onRight, onTitle, store }) => {
  return (
    <View
      style={{
        height: (height > 800) ? h(88) + 20 : h(88),
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: h(1),
        borderColor: COLORS.LIGHT_GRAY1,
      }}
    >
      <View style={{
        height: 50, width: width - 20,
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={onLeft}
          style={{ flex: 1 }}>
          <Text style={{
            fontSize: SCALE.h(34),
            fontFamily: FONTS.SF_REGULAR
          }} >
            Cancel
        </Text>
        </TouchableOpacity>
        <View style={{ flex: 2, }}>
          <TouchableWithoutFeedback onPress={onTitle}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: h(34) }}> {store.libraryTitle} </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: h(26), color: COLORS.GRAY5 }}>{store.groupName}</Text>
                <Image
                  style={{ marginLeft: h(6), marginTop: 2 }}
                  source={require('../../resources/img/post_down_arrow.png')}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity
          onPress={onRight}
          style={{ flex: 1 }}>
          <Text style={{
            fontSize: SCALE.h(34),
            textAlign: 'right',
            fontFamily: FONTS.SF_REGULAR
          }} >
            Next
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
});

@observer
@autobind
export default class CreatePost extends PureComponent {

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      isLoader: false,
      isClickable:false
    }
    isPicClicked = false;
    isVideoClicked = false;
  }

  onNavigatorEvent(event) {
    showLog("create post js ==>" + event.id);
    isPicClicked = false;
    isVideoClicked = false;
    StatusBar.setHidden(false);
    switch (event.id) {
      case "willAppear":
        this.setState({ is_loaded: true });
        showLog("create post js ==>" + event.id);
        this.props.navigator.toggleTabs({
          to: 'shown',
        });
        CreatePostStore.isOpen = CreatePostStore.inputMethod === 'Video' || CreatePostStore.inputMethod === 'Photo';
        break;
      case "didAppear":
        this.setState({ isClickable: true});
        showLog("create post js ==>" + event.id);
        break;
      case "bottomTabSelected":
        showLog("create post js ==>" + event.id);
        break;
      case "bottomTabReselected":
        showLog("create post js ==>" + event.id);
        break;
      default:
        break;
    }
  }

  capture() {

    StatusBar.setHidden(false);
    CreatePostStore.loadGallery = true;
    if(window && window.camera) {
      window.camera.capture()
        .then((data) => {
        //  this.setState({ isLoader: true })
        // isPicClicked = false;
        ImageCropPicker.openCropper({
          path: data.uri,
          // width: windowWidth,
          // height: windowWidth + 100,
          // width: windowWidth*2,
          // height: (windowWidth + 100)*2,
          width: windowWidth + (windowWidth/2),
            height: windowHeight,
          compressImageQuality:1
          }).then((image) => {
            // alert(JSON.stringify(image));
            isPicClicked = false;
          // this.setState({ isLoader: false })
          showLog("openCropper ==>"+JSON.stringify(image));
          showLog("data openCropper ==>"+JSON.stringify(data));
          data.uri = image.path;

          CreatePostStore.loadGallery = false;
        
          CreatePostStore.lastTakenPicture = data;
          CreatePostStore.gallery.arrTakenPictures.push(CreatePostStore.lastTakenPicture)
          CreatePostStore.addTakenPictureToGallery()

          // this.setState({ isLoader: false })
            this.props.navigator.push({
              screen: 'hairfolio.Gallery',
              navigatorStyle: NavigatorStyles.tab,
            });
          
          },(err)=>{
            isPicClicked = false;
            showLog("ERROR openCropper ==>"+JSON.stringify(err));
          });

        })
        .catch(err => { 
          // this.setState({ isLoader: false })
          isPicClicked = false;
          console.log(err); 
          CreatePostStore.loadGallery = false; 
        });
    }
  }

  startRecording() {
    CreatePostStore.startRecording();
  }



  stopRecording() {

    
    this.props.navigator.push({
      screen: 'hairfolio.Gallery',
      navigatorStyle: NavigatorStyles.tab,
    });
    CreatePostStore.loadGallery = true;
    CreatePostStore.stopRecording();
    isVideoClicked = false;
  }

  render() {
    if (this.state.is_loaded) {
      return this.render2();
    } else {
      return null;
    }
  }

  render2() {
    showLog("CREATE POST ==>"); 
    window.createPost = this;
    let middleElement = null;
    let cancel = () => {
      if (!CreatePostStore.gallery.wasOpened) {
        CreatePostStore.reset();
        CreatePostStore.resetEdit();
        this.props.navigator.switchToTab({
          tabIndex: 0,
        });
      } else {
        this.props.navigator.push({
          screen: 'hairfolio.Gallery',
          navigatorStyle: NavigatorStyles.tab,
        });
        StatusBar.setHidden(false);
      }
    };
    let header = (
      <SlimHeader
        // onLeft={cancel}
        // leftText='Cancel'
        title={CreatePostStore.title} />
    );
    let mainView = (
      <View>
        <CameraView isOpen={CreatePostStore.isOpen} />
      </View>
    );
    middleElement = (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'stretch',
        }}
      >

        <TouchableOpacity onPress={() => CreatePostStore.switchCameraFlashMode()} style={{ position: 'absolute', right: 0, bottom: -5, padding: SCALE.h(40) }}>
          <Image
            style={{ height: 35, width: 35 }}
            source={CreatePostStore.flashIconSource} />
        </TouchableOpacity>
          <View style={{ width:100,height:100, marginTop: -10}}>
            <TouchableOpacity
              key='photo'
              // disabled={(isPicClicked) ? true : false}
              style={{ marginTop: -10, alignSelf:"center" }}
              onPress={() => {
                if(isPicClicked == false || isPicClicked == "false"){
                  isPicClicked = true;
                  this.capture();
                  }           
              }}
            >
              <Image
                source={require('../../resources/img/post_capture.png')}
              />
            </TouchableOpacity>
          </View>
         
        <TouchableOpacity onPress={() => CreatePostStore.switchCameraType()} style={{ position: 'absolute', left: 0, bottom: 0, padding: SCALE.h(40) }}>
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
          onTitle={() => {
            this.props.navigator.push({
              screen: 'hairfolio.AlbumPage',
              navigatorStyle: NavigatorStyles.tab,
            })
          }}
          store={CreatePostStore}
          onLeft={cancel}
          onRight={() => {
            if (CreatePostStore.selectedLibraryPicture == null) {
              showAlert('Select at least one picture');
            } else {
              this.setState({ isLoader: true })
              
              CreatePostStore.addLibraryPicturesToGallary();
              // setTimeout(() => {
                this.setState({ isLoader: false })
                this.props.navigator.push({
                  screen: 'hairfolio.Gallery',
                  navigatorStyle: NavigatorStyles.tab,
                });
                StatusBar.setHidden(false);
              // }, 5000)
            }
          }}
        />
      );
    } else if (CreatePostStore.inputMethod == 'Video') {
      mainView = (
        <View>
          <VideoRecorder isOpen={CreatePostStore.isOpen} navigator={this.props.navigator} />
        </View>
      );

      if (CreatePostStore.isRecording) {
        middleElement = (
          <TouchableOpacity
            key='video-record-on'
            onPress={() => this.stopRecording()}
            style={{ position: 'absolute', alignSelf: 'center', bottom: 20 }}
          >
            <Image
              source={require('img/record_on.png')}
            />
          </TouchableOpacity>
        );
      } else {
        middleElement = (
          <TouchableOpacity
            key='video-record-off'
            onPress={() => { if(CreatePostStore.isVideoSelected != true)
            {
              if(isVideoClicked == false || isVideoClicked == "false"){
                isVideoClicked = true;
                  this.startRecording()
              }           
            } else {
              showAlert('You can\'t post more than one video.')
            }}}
            style={{ position: 'absolute', alignSelf: 'center', bottom: 20 }}
          >
            <Image
              source={require('img/record_off.png')}
            />
          </TouchableOpacity>
        );
      }
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          paddingTop: 20,
        }}
      >
        {header}
        {mainView}

        {
          (this.state.isClickable)
          ?
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {middleElement}
        </View>
        :
        null
        }


        <Footer
          onSelect={(value) => {
            CreatePostStore.changeInputMethod(value)
            CreatePostStore.isOpen = CreatePostStore.inputMethod === 'Video' || CreatePostStore.inputMethod === 'Photo';
          }}
          selectedMode={CreatePostStore.inputMethod}
        />
        {this.state.isLoader ?
          <LoadinScreen style={{ opacity: 1 }} />
          :
          null
        }
      </View>
    );
  }
};
