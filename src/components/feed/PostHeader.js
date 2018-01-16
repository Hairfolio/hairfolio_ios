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

import {profile, profileExternal, appStack} from 'Hairfolio/src/routes';

import PostDetailStore from '../../mobx/stores/PostDetailStore';
import TagPostStore from '../../mobx/stores/TagPostStore';
import CommentsStore from '../../mobx/stores/CommentsStore';

const PostHeader = observer(({post, onPress}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        appStack.scene().goToProfile(post.creator.id);
        window.navigators[0].jumpTo(appStack);
        PostDetailStore.clear();
        TagPostStore.clear();
        CommentsStore.clear();
      }}
    >
      <View
        style={{
          height: h(110),
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center'
        }}>

        <Image
          style={{height: h(70), width: h(70), borderRadius: h(70) / 2, marginLeft: h(13)}}
          source={post.creator.profilePicture.source}
        />
        <Text
          style={{
            color: '#3C3C3C',
            fontFamily: FONTS.MEDIUM,
            fontSize: h(30),
            paddingLeft: h(20),
            flex: 1
          }}
          numberOfLines={2}
        >
          {post.creator.name}
        </Text>
        <Text
          style={{
            fontSize: h(30),
            color: '#D8D8D8',
            fontFamily: FONTS.ROMAN,
            marginRight: h(22),
            marginLeft: h(22)
          }}
        >
          {post.getTimeDifference()}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default PostHeader;
