import {
  _, // lodash
  v4,
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
  ActivityIndicator,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

const FollowButton = observer(({store, style = {}}) => {

  if (store.followLoading) {
    return (
      <ActivityIndicator />
    );
  }

  if (store.isFollowing) {
    return (
      <TouchableOpacity
        onPress={() => store.unfollow()}
        style={{
          height: h(53),
          width: h(179),
          borderWidth: h(1),
          borderColor: '#9B9B9B',
          paddingLeft: h(15),
          flexDirection: 'row',
          backgroundColor: 'white',
          ...style
        }}
      >
        <Image
          style={{height: h(21), marginTop: h(12),  width: h(15)}}
          source={require('img/feed_follow.png')}
        />
        <Text
          style = {{
            color: '#393939',
            fontSize: h(20),
            paddingLeft: h(5),
            paddingTop: h(12),
            fontFamily: FONTS.HEAVY_OBLIQUE
          }}
        >
          FOLLOWING
        </Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={() => store.follow()}
        style={{
          height: h(53),
          width: h(115),
          borderWidth: h(1),
          borderColor: '#B5B5B5',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          ...style
        }}
      >
        <Text
          style = {{
            color: '#868686',
            fontSize: h(20),
            fontFamily: FONTS.HEAVY_OBLIQUE
          }}
        >
          FOLLOW
        </Text>
      </TouchableOpacity>
    );
  }
});

export default FollowButton;
