import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, Dimensions, StatusBar, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import _ from 'lodash';
import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';
import CreatePostStore from '../mobx/stores/CreatePostStore';
import Camera from 'react-native-camera';
import SlimHeader from '../components/SlimHeader';

@observer
@autobind
export default class PostFilter extends PureComponent {

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
        }}
      >
        <SlimHeader
          onLeft={() =>{
            this.navigator.pop({ anmiated: true });
          }}
          leftText='Retake'
          rightText='Use Photo'
          onRight={() => {
            CreatePostStore.addTakenPictureToGallery()
            this.navigator.pop({ anmiated: true });
            StatusBar.setHidden(false);
          }}
        />
      <Image
        style={{width:  Dimensions.get('window').width, height: Dimensions.get('window').width
        }}
        source={{uri: CreatePostStore.lastTakenPicture.path}}/>
      </View>
    );
  }
};
