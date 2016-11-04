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

import PostDetailsHeader from 'components/feed/PostDetailsHeader.js'
import PostDetailsImageList from 'components/feed/PostDetailsImageList.js'

import PostDetailsColorFormula from 'components/feed/PostDetailsColorFormula.js'

import PostDescription from 'components/feed/PostDescription.js'


const PostDetailsContent = observer(() => {

  let store = PostDetailStore;
  return (
    <ScrollView
      ref={el => {store.scrollView = el}}
    >
      <PostDetailsHeader />
      <PostDetailsImageList />
      <PostDescription
        style={{paddingTop: h(28)}}
        post={store.post}
        />
      <PostDetailsColorFormula />
    </ScrollView>
  );
});

export default PostDetailsContent;
