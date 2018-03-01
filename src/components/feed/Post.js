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

const Post = observer(({post, navigator}) => {
  return (
    <View>
      <View style={{height: h(20), backgroundColor: '#F4F4F4', flex: 1}} />
      <PostHeader post={post} navigator={navigator}/>
      <PostPicture post={post} navigator={navigator}/>
      <PostActionButtons post={post} navigator={navigator}/>
      <PostDescription limitLinesNumbers currentRoute={null} post={post} navigator={navigator}/>
    </View>
  );
});

export default Post;
