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


import Swiper from 'react-native-swiper';

let autoplay;
if (process.env.NODE_ENV == 'production') {
  autoplay = true;
} else {
  autoplay = false;
}

const PostPicture = observer(({post}) => {
  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        let data = e.touchHistory.touchBank[1];
        let timeDiff = data.currentTimeStamp - data.previousTimeStamp;

        let currentClickTime = (new Date()).getTime();

        if (post.lastClickTime) {
          let diff = currentClickTime - post.lastClickTime;

          if (diff < 300) {
            post.starPost();
          }
        }

        post.lastClickTime = currentClickTime;
      }}
      onLongPress={(e) => {
        console.log('long press');
        post.savePost();
      }}
    >
      <View>
        <View
          style={{height: windowWidth, width: windowWidth}}>
          <Swiper
            showsButtons={false}
            showsPagination={false}
            index={post.currentIndex}
            refs={(el) => window.swiper = el}
            autoplay={autoplay}
            onMomentumScrollEnd={
              (e, {index}, context) => {
                post.currentIndex = index;
              }
            }
          >
            {post.pictures.map(
              (pic) => (
                <Image
                  key={pic.key}
                  style={{height: windowWidth, width: windowWidth}}
                  source={pic.source}
                />
              )
            )}
          </Swiper>
          <PostStar post={post} />
          <PostSave post={post} />

          <View
            style={{
              position: 'absolute',
              right: h(18),
              bottom: h(18),
              backgroundColor: 'white',
              paddingVertical: h(7),
              paddingHorizontal: h(14)
            }}
          >
            <Text
              style={{
                fontSize: h(28),
                fontFamily: FONTS.LIGHT_OBLIQUE,
                color: '#8D8D8D'
              }}
            >
              {post.photoInfo}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>

  );
});

const PostStar = observer(({post}) => {

  if (!post.showStar) {
    return null;
  }


  return (
    <View
      style={{
        height: windowWidth,
        width: windowWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    <Image
      style={{
        height: h(221),
        width: h(223),
        opacity: 0.73
      }}
      source={require('img/feed_action_star.png')}
    />
    </View>
  );
});


const PostSave = observer(({post}) => {

  if (!post.showSave) {
    return null;
  }


  return (
    <View
      style={{
        height: windowWidth,
        width: windowWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    <Image
      style={{
        height: h(265),
        width: h(265),
        opacity: 0.73
      }}
      source={require('img/feed_action_save.png')}
    />
    </View>
  );
});


export default PostPicture;
