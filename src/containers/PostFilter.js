import React from 'react';
import PureComponent from '../components/PureComponent';
import {View, Text, Image, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import connect from '../lib/connect';
import {app} from '../selectors/app';
import {post} from '../selectors/post';
import {postActions} from '../actions/post';
import {COLORS, FONTS, SCALE} from '../style';
import NavigationSetting from '../navigation/NavigationSetting';
import {observer} from 'mobx-react/native';
import autobind from 'autobind-decorator'

import _ from 'lodash';

import {STATUSBAR_HEIGHT, POST_INPUT_MODE} from '../constants';

import CreatePostStore from '../mobx/stores/CreatePostStore.js';

import Camera from 'react-native-camera';
import SlimHeader from '../components/SlimHeader.js'


import {
  createPost,
  postFilter,
  appStack
} from '../routes';


@connect(app, post)
@observer
@autobind
export default class PostFilter extends PureComponent {

  static contextTypes = {
    navigators: React.PropTypes.array.isRequired
  };

  render() {
    console.log('pasth', CreatePostStore.lastPicture.path);
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
          onLeft={() =>
              _.last(this.context.navigators).jumpTo(createPost)
          }
          leftText='Retake'
          rightText='Use Photo'
        />

      <Image
        style={{width:  Dimensions.get('window').width, height: Dimensions.get('window').width
        }}
        source={{uri: CreatePostStore.lastPicture.path}}/>
      </View>
    </NavigationSetting>
    );
  }
};
