import { COLORS, FONTS, h, Image, observer, React, Text, TouchableWithoutFeedback, View, windowWidth, showLog } from '../../helpers';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import FavoriteStore from '../../mobx/stores/FavoriteStore';
import PostSave from './PostSave';
import PostStar from './PostStar';

let count = 0;

@observer
class InstantSwiper extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    };
    this.currentImage = <View />;
    let pictures = this.props.post.pictures;
    const placeholder_icon = require('img/medium_placeholder_icon.png');
    
    let images = [];

    for (let pic of pictures) {
     
      images.push(
        <Image
          key={(pic.key) ? pic.key : count++}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: windowWidth,
            width: windowWidth
          }}
          defaultSource={placeholder_icon}
          source={(pic) ? pic.getSource(windowWidth * 2, windowWidth * 2) : placeholder_icon}
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
        },
        1500
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
    const placeholder_icon = require('img/medium_placeholder_icon.png');
    let infoText = `${this.state.currentIndex + 1} of ${this.props.post.pictures.length}`;

    this.props.post.length = 5;
    for (let pic of this.props.post.pictures) {
      index += 1;
      imageArray.push(
        <Image
          key={(pic.key) ? pic.key : count++}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: this.state.currentIndex == index ? 1 : 0,
            height: windowWidth * (4 / 2.7),
            width: windowWidth,
            flex:1
          }}
          resizeMode={'cover'}
          defaultSource={placeholder_icon}
          source={(pic) ? pic.getSource(windowWidth * 2, windowWidth * 2) : placeholder_icon}
        />
      );
    }
    return (
      <View
        style={{
          height: windowWidth * (4 / 2.7),
          width: windowWidth
        }}
        key={(pic.key) ? pic.key : count++}>
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
              style={{ height: 20, width: 20 }}
            />
          </View>
          : <View />
        }
        <View
          style={{
            position: 'absolute',
            right: h(18),
            bottom: h(18),
            backgroundColor: COLORS.WHITE,
            paddingVertical: h(7),
            paddingHorizontal: h(14)
          }}
        >
          <Text
            style={{
              fontSize: h(28),
              fontFamily: FONTS.LIGHT_OBLIQUE,
              color: COLORS.DARK5
            }}
          >
            {infoText}
          </Text>
        </View>
      </View>
    )
  }
}

const PostPicture = observer(({ post, navigator }) => {
  
  return (
    <TouchableWithoutFeedback
      onPress={ async (e) => {
        let data = e.touchHistory.touchBank[1];
        let timeDiff = data.currentTimeStamp - data.previousTimeStamp;
        let currentClickTime = (new Date()).getTime();
        let time = currentClickTime;
        let oneClickFun = () => {
          
          if (time == post.lastClickTime && !post.doubleClick) {
            PostDetailStore.jump(
              false,
              post,
              navigator,
              'from_feed'
            );
          } else {
            post.doubleClick = false;
          }
        };
        if (post.lastClickTime) {
          let diff = currentClickTime - post.lastClickTime;

          if (diff < 300) {
            post.doubleClick = true;
            let b2 = await post.starPost();
              showLog("cool2 ==>"+JSON.stringify(b2));
              let post2 = new Post();
              await post2.init(b2.like.post);
              FavoriteStore.elements.push(post2);
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
          style={{ height: windowWidth * (4 / 2.7), width: windowWidth }}
        >
          <InstantSwiper post={post} />
          <PostStar post={post} />
          <PostSave post={post} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default PostPicture;
