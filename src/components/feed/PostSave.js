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

import * as routes from 'Hairfolio/src/routes';


const PostSave = observer(({post}) => {

  if (!post.showSave) {
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
        height: h(265),
        width: h(265),
        opacity: 0.73
      }}
      source={require('img/feed_action_save.png')}
    />
    </View>
  );
});

export default PostSave;
