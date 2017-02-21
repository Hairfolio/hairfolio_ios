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

import * as routes from 'hairfolio/src/routes';

import PostDetailStore from 'stores/PostDetailStore';

import PostStar from 'components/feed/PostStar.js'
import PostSave from 'components/feed/PostSave.js'

import Swiper from 'react-native-swiper';

@observer
class InstantSwiper extends React.Component {

  constructor(props) {
    super(props)
  }


  componentDidMount() {
    this.autoplayFun = setInterval(
      () => {
        this.props.post.nextImage();
      },
      3000
    );
  }

  componentWillUnmount() {
    clearInterval(this.autoplayFun);
  }

  render() {

    let pic = this.props.post.currentImage;

    return  (
      <View key={pic.key}>
        <Image
          key={pic.key}
          style={{height: windowWidth, width: windowWidth}}
          source={pic.getSource(windowWidth * 2)}
        />
        {pic.isVideo ?
            <View
              style={{
                position: 'absolute',
                right: h(18),
                bottom: h(80)
              }}
            >
              <Image
                source={require('img/play_button.png')}
                style={{height: 20, width: 20}}
              />
            </View>
            : <View />
        }
      </View>
    )
  }
}

const PostPicture = observer(({post}) => {
  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        let data = e.touchHistory.touchBank[1];
        let timeDiff = data.currentTimeStamp - data.previousTimeStamp;

        let currentClickTime = (new Date()).getTime();

        let time = currentClickTime;

        let oneClickFun = () => {
          if (time == post.lastClickTime && !post.doubleClick) {
            PostDetailStore.jump(
              false,
              post,
              () => window.navigators[0].jumpTo(routes.appStack)
            );
          } else {
            post.doubleClick = false;
          }
        };


        if (post.lastClickTime) {
          let diff = currentClickTime - post.lastClickTime;

          if (diff < 300) {
            post.doubleClick = true;
            post.starPost();
          } else {
            setTimeout(oneClickFun, 350);
          }
        } else {
          setTimeout(oneClickFun, 350);
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

          <InstantSwiper post={post} />

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

export default PostPicture;
