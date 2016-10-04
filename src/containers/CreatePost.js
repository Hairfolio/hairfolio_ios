import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  StatusBar,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, h, SCALE} from 'hairfolio/src/style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'
import _ from 'lodash';

import {appStack, gallery, postFilter, albumPage} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import CreatePostStore from '../mobx/stores/CreatePostStore.js';

import Camera from 'react-native-camera';

import SlimHeader from '../components/SlimHeader.js'
import LibraryListView from 'components/post/LibraryListView'

const CameraView = observer(({isOpen, inputMethod}) => {

  if (!isOpen) {
    return (
      <View
        style={{backgroundColor: 'black', height: Dimensions.get('window').width, width: Dimensions.get('window').width, }}
      />
    );
  }


  return (
    <View>
      <Camera
        ref={(cam) => {
          window.camera = cam;
        }}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width
        }}
        captureMode={inputMethod === 'Video' ? Camera.constants.CaptureMode.video : Camera.constants.CaptureMode.photos}
        aspect={Camera.constants.Aspect.fill}>

        <TouchableOpacity onPress={() => alert('light')} style={{ position: 'absolute', right: 0, bottom: 0, padding: SCALE.h(40)}}>
          <Image
            source={require('../../resources/img/post_light.png')} />
        </TouchableOpacity>
      </Camera>
    </View>
  );
});

const LibraryPreview = observer(({store}) => {

  let windowWidth =  Dimensions.get('window').width;

  console.log('selectedPicture', store.selectedLibraryPicture);

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
        onPress={() => { /* onSelect('Video')*/ }}>
        <View style={{flex: 1}}>
          {/* <Text style={{
            fontSize: SCALE.h(34),
            fontFamily: selectedMode === 'Video' ? FONTS.SF_BOLD : FONTS.SF_REGULAR,
            textAlign: 'right',
            flex: 1
          }}>Video</Text>*/}
      </View>
    </TouchableWithoutFeedback>
  </View>
  );
};



const LibraryHeader = observer(({onLeft, onRight, onTitle, store}) => {
  console.log('rerender library header');
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

@connect(app, post)
@observer
@autobind
export default class CreatePost extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  capture() {
    window.camera.capture()
      .then((data) => {
        CreatePostStore.lastTakenPicture = data;
        _.last(this.context.navigators).jumpTo(postFilter);
      })
      .catch(err => { alert('error'); console.error(err) });
  }

  render() {
    window.createPost = this;

    let middleElement = (
      <TouchableOpacity onPress={() => this.capture()}>
        <Image
          source={require('../../resources/img/post_capture.png')}
        />
      </TouchableOpacity>
    );

    let cancel = () => {
      if (!CreatePostStore.gallery.wasOpened) {
        CreatePostStore.reset();
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

    let mainView = <CameraView isOpen={CreatePostStore.isOpen} inputMethod={CreatePostStore.inputMethod} />;

    if (CreatePostStore.inputMethod === 'Library') {
      middleElement = (
        <LibraryListView store={CreatePostStore} />
      );

      mainView = (<LibraryPreview store={CreatePostStore} />);

      header = (
        <LibraryHeader
          onTitle={() => { window.navigators =  this.context.navigators; _.last(this.context.navigators).jumpTo(albumPage) }}
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
