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
import PostDetailStore from 'stores/PostDetailStore.js'

import PostDetailsHeader from 'components/feed/PostDetailsHeader.js'
import PostDetailsImageList from 'components/feed/PostDetailsImageList.js'

import PostDetailsColorFormula from 'components/feed/PostDetailsColorFormula.js'

import PostDescription from 'components/feed/PostDescription.js'

import * as routes from 'hairfolio/src/routes.js'

const PostDetailsContent = observer(() => {

  if (PostDetailStore.isEmpty) {
    return null;
  }

  let store = PostDetailStore.currentStore;


  return (
    <ScrollView
      ref={el => {store.scrollView = el}}
    >
      <PostHeader post={store.post} />
      <PostDetailsHeader store={store} />
      <PostDetailsImageList store={store} />
      <PostDescription
        style={{paddingTop: h(28)}}
        post={store.post}
        currentRoute={routes.postDetails}
        />
      <PostDetailsColorFormula store={store} />
    </ScrollView>
  );
});

export default PostDetailsContent;
