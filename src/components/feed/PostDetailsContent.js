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


const PostDetailsContent = observer(({navigator}) => {

  if (PostDetailStore.isEmpty) {
    return null;
  }

  let store = PostDetailStore.currentStore;

  return (
    <ScrollView
      ref={el => {store.scrollView = el}}
      scrollEventThrottle={16}
      onScroll={(e) => {
        const offset = e.nativeEvent.contentOffset.y;
        if (offset > 0) {
          navigator.toggleTabs({
            to: 'shown',
          });
        } else {
          navigator.toggleTabs({
            to: 'hidden',
          });
        }
      }}
    >
      <PostHeader
        post={store.post}
        navigator={navigator}
      />
      <PostDetailsHeader
        store={store}
        navigator={navigator}
      />
      <PostDetailsImageList
        store={store}
      />
      <PostDescription
        style={{paddingTop: h(28)}}
        post={store.post}
        navigator={navigator}
      />
      <PostDetailsColorFormula
        store={store}
        navigator={navigator}
      />
    </ScrollView>
  );
});

export default PostDetailsContent;
