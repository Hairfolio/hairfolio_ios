import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
  autobind,
  React, // react
  Component,
  windowWidth,
  windowHeight,
  // react-native components
  AlertIOS,
  Modal,
  ScrollView,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import PostHeader from 'components/feed/PostHeader.js'
import PostPicture from 'components/feed/PostPicture.js'
import PostActionButtons from 'components/feed/PostActionButtons.js'
import PostDescription from 'components/feed/PostDescription.js'

import * as routes from 'hairfolio/src/routes.js'

import Swiper from 'react-native-swiper';

const Post = observer(({post}) => {
  return (
    <View>
      <View style={{height: h(20), backgroundColor: '#F4F4F4', flex: 1}} />
      <PostHeader post={post} />
      <PostPicture post={post} />
      <PostActionButtons post={post} />
      <PostDescription currentRoute={routes.appStack} post={post} />
    </View>
  );
});

export default Post;
