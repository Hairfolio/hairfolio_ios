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
import NavigatorStyles from '../../common/NavigatorStyles';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import StarGiversStore from '../../mobx/stores/StarGiversStore';
import CommentsStore from '../../mobx/stores/CommentsStore';
import PostTags from './PostTags';
import PostStar from './PostStar';
import PostSave from './PostSave';
import VideoPreview from '../VideoPreview';
import WriteMessageStore from '../../mobx/stores/WriteMessageStore';

const PostDetailsActionButtons = observer(({store, navigator}) => {
  return (
    <View
      style = {{
        position: 'absolute',
        left: h(24),
        bottom: h(24),
        flexDirection: 'row',
      }}
    >
      <TouchableOpacity
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(120),
          backgroundColor: 'transparent',
        }}
        onPress={() => {
          StarGiversStore.load(store.post.id);
          navigator.push({
            screen: 'hairfolio.StarGivers',
            navigatorStyle: NavigatorStyles.tab,
          });
        }}
      >
        <Image
          style={{height: h(40), width: h(43)}}
          source={store.post.starImageSourceWhite}
        />
        <Text
          style = {{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5)
          }}
        >
          {store.post.starNumber}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(100),
          backgroundColor: 'transparent',
        }}
        onPress={() => {
          CommentsStore.jump(
            store.post.id,
            navigator
          );
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
            paddingLeft: h(5)
          }}
        >
          {store.post.numberOfComments}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(120),
          backgroundColor: 'transparent',
        }}
        onPress={() => { store.showTags = !store.showTags }}
      >
        <Image
          style={{height: h(39), width: h(40)}}
          source={store.tagImage}
        />
        <Text
          style = {{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(8)
          }}
        >
          {store.numberOfTags}
        </Text>
      </TouchableOpacity>
    </View>
  );
});


const PostDetailsHeader = observer(({store, navigator}) => {
  let post = store.post;
  return (
    <TouchableWithoutFeedback
      onPress={
        (e) => {
          let data = e.touchHistory.touchBank[1];
          let timeDiff = data.currentTimeStamp - data.previousTimeStamp;

          let currentClickTime = (new Date()).getTime();

          let time = currentClickTime;

          let oneClickFun = () => {
            if (time == post.lastClickTime && !post.doubleClick) {
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

    <View style={{height: windowWidth * (4/3), width: windowWidth}}>
      {
        store.selectedPicture.isVideo ?
       <VideoPreview picture={store.selectedPicture}  post={post} /> :
        <Image
          style={{height: windowWidth * (4/3), width: windowWidth}}
          source={store.selectedPicture.getSource(2 * windowWidth, 2 * windowWidth)}
        />
      }

        <TouchableOpacity
          style = {{
            position: 'absolute',
            top: h(20),
            paddingVertical: h(20),
            left: h(13),
            paddingHorizontal: h(20)
          }}
          onPress={() => store.back()}
        >
          <Image
            style={{height: h(29), width: h(42)}}
            source={require('img/feed_white_arrow_back.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style = {{
            position: 'absolute',
            top: h(23),
            right: h(13),
            paddingHorizontal: h(20),
            paddingVertical: h(20)
          }}
          onPress={
            () => {
              WriteMessageStore.navigator = navigator;
              WriteMessageStore.mode = 'POST';
              WriteMessageStore.post = post;
              navigator.push({
                screen: 'hairfolio.WriteMessage',
                navigatorStyle: NavigatorStyles.basicInfo,
                title: WriteMessageStore.title,
              });
            }
          }
        >
          <Image
            style = {{
              height: h(27),
              width: h(43)
            }}
            source={require('img/feed_white_share_btn.png')}
          />
        </TouchableOpacity>
        <PostTags store={store} navigator={navigator} />
        <PostDetailsActionButtons store={store} navigator={navigator} />
        <PostSave post={post} />
        <PostStar post={post} />
      </View>
    </TouchableWithoutFeedback>
  );
});


export default PostDetailsHeader;
