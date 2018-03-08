import {
  _, // lodash
  v4,
  observable,
  computed,
  moment,
  action,
  observer, // mobx
  h,
  FONTS,
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
import PostDetailStore from '../../mobx/stores/PostDetailStore';

const ActionButtons = observer(({post}) => {
  return (
    <View
      style = {{
        position: 'absolute',
        left: h(18),
        bottom: h(18),
        flexDirection: 'row',
      }}
    >
      <View
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(120),
        }}
      >
        <Image
          style={{height: h(40), width: h(43)}}
          source={post.starImageSourceWhite}
        />
        <Text
          style = {{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5),
            backgroundColor: 'transparent'
          }}
        >
          {post.starNumber}
        </Text>
      </View>

      <View
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(100)
        }}
      >
        <Image
          style={{height: h(39), width: h(40)}}
          source={require('img/feed_white_comments.png')}
        />
        <Text
          style = {{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5),
            backgroundColor: 'transparent'
          }}
        >
          {post.numberOfComments}
        </Text>
      </View>

    </View>
  );
});

const GridPost = observer(({post, navigator}) => {
  return (
    <TouchableWithoutFeedback
      onPress={
        () => {
          PostDetailStore.jump(
            false,
            post,
            navigator
          );
        }
      }
    >
      <View
        style = {{
          width: windowWidth / 2,
          height: windowWidth / 2
        }}
      >
        <Image
          style={{
            width: windowWidth / 2,
            height: windowWidth / 2
          }}
          source={post.pictures[0].getSource(Math.round(windowWidth / 2))}
        />
        <ActionButtons post={post} />
      </View>
    </TouchableWithoutFeedback>


  );
});

export default GridPost;
