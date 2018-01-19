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
import PostDetailStore from '../../mobx/stores/PostDetailStore';

import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsImageList from './PostDetailsImageList';

import PostDetailsColorFormula from './PostDetailsColorFormula';

import PostDescription from './PostDescription';

import * as routes from 'Hairfolio/src/routes';

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
