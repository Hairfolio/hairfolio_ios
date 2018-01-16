import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, Dimensions, StatusBar, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'

import _ from 'lodash';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import CreatePostStore from '../mobx/stores/CreatePostStore';

import Camera from 'react-native-camera';
import SlimHeader from '../components/SlimHeader';


import {
  createPost,
  postFilter,
  appStack,
  gallery
} from '../routes';

@observer
@autobind
export default class PostFilter extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
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
      <View
        style={{
          flex: 1
        }}
      >
        <SlimHeader
          onLeft={() =>{
            _.last(this.context.navigators).jumpTo(createPost);
          }}
          leftText='Retake'
          rightText='Use Photo'
          onRight={() => {
            CreatePostStore.addTakenPictureToGallery()
            _.last(this.context.navigators).jumpTo(gallery)
            StatusBar.setHidden(false);
          }}
        />

      <Image
        style={{width:  Dimensions.get('window').width, height: Dimensions.get('window').width
        }}
        source={{uri: CreatePostStore.lastTakenPicture.path}}/>
      </View>
    </NavigationSetting>
    );
  }
};
