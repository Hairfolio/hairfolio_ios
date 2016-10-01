import React from 'react';
import PureComponent from '../components/PureComponent';
import {
  CameraRoll,
  ScrollView,
  View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'

import _ from 'lodash';
import {appStack, postFilter} from '../routes';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import CreatePostStore from '../mobx/stores/CreatePostStore.js';

import Camera from 'react-native-camera';

import SlimHeader from '../components/SlimHeader.js'


const CameraView = observer(({isOpen, inputMethod}) => {

  if (!isOpen) {
    return (
      <View
        style={{backgroundColor: 'black', height: Dimensions.get('window').width, width: Dimensions.get('window').width, }}
      />
    );
  }


  if (inputMethod === 'Library') {
    return (
      <View
        style={{height: Dimensions.get('window').width, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{fontSize: 30, textAlign: 'center'}}> Last 20 pictures </Text>
      </View>
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
        onPress={() => {/*onSelect('Video')*/}}>
        <View style={{flex: 1}}>
          {/*<Text style={{
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

const LibraryView = observer(({pictures}) => {
  return (
    <ScrollView style={{height: Dimensions.get('window').height - 2 * (SCALE.h(88) + Dimensions.get('window').width), width: Dimensions.get('window').width}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {pictures.map((el) =>
          <Image
            style={{
              borderColor: 'white',
              borderWidth: 1,
              height: Dimensions.get('window').width / 3,
              width: Dimensions.get('window').width / 3}}
              source={{uri: el.uri}}

              key={el.key}
            />
      )}
    </View>
    </ScrollView>
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
        CreatePostStore.lastPicture = data;
        _.last(this.context.navigators).jumpTo(postFilter);
      })
      .catch(err => { alert('error'); console.error(err) });
  }

  render() {

    let middleElement = (
      <TouchableOpacity onPress={() => this.capture()}>
        <Image
          source={require('../../resources/img/post_capture.png')}
        />
      </TouchableOpacity>
    );

    if (CreatePostStore.inputMethod === 'Library') {
      middleElement = (
        <LibraryView
          pictures={CreatePostStore.libraryPictures}
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
      <SlimHeader
        onLeft={() => {
          CreatePostStore.isOpen = false;
          _.first(this.context.navigators).jumpTo(appStack);
        }}
        leftText='Cancel'
        title={CreatePostStore.inputMethod}/>
      <CameraView isOpen={CreatePostStore.isOpen} inputMethod={CreatePostStore.inputMethod} />


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
