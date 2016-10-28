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




const PostActionButtons = observer(({post}) => {
  return (
    <View
      style={{
        height: h(100),
        flexDirection: 'row',
        paddingHorizontal: h(31),
        alignItems: 'center',
        borderBottomWidth: h(2),
        borderBottomColor: '#C1C1C1'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          marginRight: h(50)
        }}
      >
        <Image
          style={{
            height: h(40),
            width: h(43),
            marginRight: h(15)
          }}
          source={post.starImageSource} />
        <Text
          style={{
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            color: '#BABABA'
          }}
        >
          {post.starNumber}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginRight: h(50)
        }}
      >
        <Image
          style={{
            height: h(39),
            width: h(51),
            marginRight: h(15),
            marginTop: h(3)
          }}
          source={require('img/feed_comments.png')} />
        <Text
          style={{
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            color: '#BABABA'
          }}
        >
          {post.numberOfComments}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginRight: h(50)
        }}
      >
        <Image
          style={{
            height: h(38),
            width: h(38),
            marginRight: h(15),
            marginTop: h(3)
          }}
          source={require('img/feed_tags.png')} />
        <Text
          style={{
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            color: '#BABABA'
          }}
        >
          {post.numberOfTags}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <Image
          style={{
            height: h(26),
            width: h(46),
          }}
          source={require('img/feed_share.png')} />
      </View>
      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <Image
          style={{
            height: h(13),
            width: h(59),
            marginRight: h(15),
          }}
          source={require('img/feed_more.png')} />
      </View>

    </View>

  );
});


export default PostActionButtons;
