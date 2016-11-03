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

import PostDetailStore from 'stores/PostDetailStore.js'


const PostDetailsImage = observer(({picture, index}) => {
  let store = PostDetailStore;

  return (
    <TouchableWithoutFeedback
      onPress={
        () =>  store.selectedIndex = index
      }
    >
      <Image
        style={{height: windowWidth / 4, width: windowWidth / 4, borderWidth: 1, borderColor: 'white'}}
        source={picture.source}
      />
    </TouchableWithoutFeedback>

  );
});

const PostDetailsImageList = observer(() => {

  let store = PostDetailStore;

  return (
    <ScrollView
      bounces={false}
      style={{height: windowWidth / 4, width: windowWidth}}
      horizontal
    >
      {store.post.pictures.map(
        (e, index) => <PostDetailsImage key={e.key} index={index} picture={e} />
      )}
    </ScrollView>
  );
});


export default PostDetailsImageList;
