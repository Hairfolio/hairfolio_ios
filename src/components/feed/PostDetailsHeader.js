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

import PostDetailStore from 'stores/PostDetailStore.js'
import StarGiversStore from 'stores/StarGiversStore.js'
import CommentsStore from 'stores/CommentsStore.js'

import PostTags from 'components/feed/PostTags.js'

import PostStar from 'components/feed/PostStar.js'
import PostSave from 'components/feed/PostSave.js'
import VideoPreview from 'components/VideoPreview.js'

import * as routes from 'hairfolio/src/routes.js'

import WriteMessageStore from 'stores/WriteMessageStore'

const PostDetailsActionButtons = observer(({store}) => {

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
        }}
        onPress={() => {
          StarGiversStore.back = () => window.navigators[0].jumpTo(routes.postDetails);
          StarGiversStore.load(store.post.id);
          window.navigators[0].jumpTo(routes.starGivers);
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
          width: h(100)
        }}
        onPress={() => {
          CommentsStore.jump(
            store.post.id,
            () => window.navigators[0].jumpTo(routes.postDetails)
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
          width: h(120)
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


const PostDetailsHeader = observer(({store}) => {
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

    <View style={{height: windowWidth, width: windowWidth}}>
      {
        store.selectedPicture.isVideo ?
       <VideoPreview picture={store.selectedPicture} /> :
        <Image
          style={{height: windowWidth, width: windowWidth}}
          source={store.selectedPicture.getSource(2 * windowWidth)}
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
              WriteMessageStore.myBack = () => window.navigators[0].jumpTo(routes.postDetails);
              WriteMessageStore.mode = 'POST';
              WriteMessageStore.post = post;
              window.navigators[0].jumpTo(routes.writeMessageRoute);
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
        <PostTags store={store} />
        <PostDetailsActionButtons store={store} />
        <PostSave post={post} />
        <PostStar post={post} />
      </View>

    </TouchableWithoutFeedback>
  );
});


export default PostDetailsHeader;
