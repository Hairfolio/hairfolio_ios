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


  // alert(JSON.stringify(navigator));

  if (PostDetailStore.isEmpty) {
    return null;
  }
  let value = PostDetailStore.currentStore;//props.value;
  // let store = PostDetailStore.getPostDetails();
  return (
    
    <ScrollView
      ref={el => {value.scrollView = el}}
      scrollEventThrottle={16}
      onScroll={async (e) => {
        const offset = e.nativeEvent.contentOffset.y;
        const isVisible = await navigator.screenIsCurrentlyVisible()
        if(isVisible) {
          if (offset > 0) {
            navigator.toggleTabs({
              to: 'shown',
            });
          } else {
            navigator.toggleTabs({
              to: 'hidden',
            });
          }
        }
      }}
    >
      <PostHeader
        post={value.post}
        navigator={navigator}
      />
      <PostDetailsHeader
        store={value}
        navigator={navigator}
      />
      <PostDetailsImageList
        store={value}
      />
      <PostDescription
        style={{paddingTop: h(28)}}
        post={value.post}
        navigator={navigator}
      />
      <PostDetailsColorFormula
        store={value}
        navigator={navigator}
      />
    </ScrollView>
  );
});

export default PostDetailsContent;
