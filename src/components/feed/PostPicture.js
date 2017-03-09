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

    this.state = {
      currentIndex: 0
    };

    this.currentImage = <View />;



    let pictures = this.props.post.pictures;

    let images = [];

    for (let pic of pictures) {
      images.push(
        <Image
          key={pic.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: windowWidth,
            width: windowWidth
          }}
          source={pic.getSource(windowWidth * 2)}
        />
      );
    }

    this.images = images;
  }


  componentDidMount() {
    if (this.images.length > 1) {
      this.autoplayFun = setInterval(
        () => {
          this.setState({
            currentIndex: (this.state.currentIndex + 1) % this.images.length
          });
          // this.props.post.nextImage();
        },
        300
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.autoplayFun);
  }

  render() {

    let pic = this.props.post.currentImage;

    let imageArray = [];

    let index = -1;

    let infoText = `${this.state.currentIndex + 1} of ${this.props.post.pictures.length}`;
    for (let pic of this.props.post.pictures) {
      index += 1;
      imageArray.push(
        <Image
          key={pic.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: this.state.currentIndex == index ? 1 : 0,
            height: windowWidth,
            width: windowWidth
          }}
          source={pic.getSource(windowWidth * 2)}
        />
      );
    }

    return  (
      <View
        style={{
          height: windowWidth,
          width: windowWidth
        }}

        key={pic.key}>

        {imageArray}
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
            {infoText}
          </Text>
        </View>
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
        post.savePost();
      }}
    >
      <View>
        <View
          style={{height: windowWidth, width: windowWidth}}>

          <InstantSwiper post={post} />

          <PostStar post={post} />
          <PostSave post={post} />




                  </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default PostPicture;
