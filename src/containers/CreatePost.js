import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';

import _ from 'lodash';
import {appStack} from '../routes';

import {STATUSBAR_HEIGHT} from '../constants';


import Camera from 'react-native-camera';

const Header = (__, context) => {
  return (
    <View style={{
      height: SCALE.h(88),
      paddingHorizontal: SCALE.h(25),
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderColor: 'black'}}>
      <TouchableOpacity
        onPress={() => {
          _.first(context.navigators).jumpTo(appStack);
        }}
        style={{flex: 1}}>
        <Text style={{
          fontSize: SCALE.h(34),
          fontFamily: FONTS.SF_REGULAR}} >
          Cancel
        </Text>
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: SCALE.h(34),
            fontFamily: FONTS.SF_BOLD }}>
          Photo
        </Text>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
};


Header.contextTypes = {navigators: React.PropTypes.array.isRequired};

const CameraView = () => {
  return (
    <View>
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width
        }}
        aspect={Camera.constants.Aspect.fill}>
      </Camera>
      <TouchableOpacity onPress={() => alert('press')} style={{ position: 'absolute', right: 0, bottom: 0, padding: SCALE.h(40)}}>
        <Image
          source={require('../../resources/img/post_light.png')} />
      </TouchableOpacity>
    </View>
  );
};

const Footer = ({selectedMode, onSelect}) => {
  return (
    <View style={{flexDirection: 'row',  alignItems: 'center', marginVertical: SCALE.h(46), paddingHorizontal: SCALE.h(25)}}>
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
        onPress={() => onSelect('Video')}>
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

@connect(app, post)
export default class CreatePost extends PureComponent {
  static propTypes = {
    appVersion: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  takePicture() {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }

  render() {

    console.log('render CreateProps', this.props);

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
      <Header />
      <CameraView />

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={() => alert('capture')}>
          <Image
            source={require('../../resources/img/post_capture.png')}
          />
        </TouchableOpacity>
      </View>
      <Footer
        onSelect={
          (value) => {
            this.props.dispatch(postActions.changeInputMode(value));
          }
        }

        selectedMode={this.props.inputMethod} />

          </View>
        </NavigationSetting>);
  }
};
