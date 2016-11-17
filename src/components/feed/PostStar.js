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

import * as routes from 'hairfolio/src/routes';

const PostStar = observer(({post}) => {

  if (!post.showStar) {
    return null;
  }

  return (
    <View
      style={{
        height: windowWidth,
        width: windowWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    <Image
      style={{
        height: h(221),
        width: h(223),
        opacity: 0.73
      }}
      source={require('img/feed_action_star.png')}
    />
    </View>
  );
});


export default PostStar;
