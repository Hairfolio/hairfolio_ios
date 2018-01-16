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
} from 'Hairfolio/src/helpers';

import PostHeader from './PostHeader';
import PostPicture from './PostPicture';
import PostActionButtons from './PostActionButtons';
import PostDescription from './PostDescription';

import * as routes from 'Hairfolio/src/routes';


const Post = observer(({post}) => {
  return (
    <View>
      <View style={{height: h(20), backgroundColor: '#F4F4F4', flex: 1}} />
      <PostHeader post={post} />
      <PostPicture post={post} />
      <PostActionButtons post={post} />
      <PostDescription limitLinesNumbers currentRoute={routes.appStack} post={post} />
    </View>
  );
});

export default Post;
