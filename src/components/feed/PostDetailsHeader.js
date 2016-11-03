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

import PostTags from 'components/feed/PostTags.js'

const PostDetailsActionButtons = observer(() => {
  let store = PostDetailStore;

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
        onPress={() => {store.showTags = !store.showTags}}
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


const PostDetailsHeader = observer(() => {

  let store = PostDetailStore;

  return (
    <View style={{height: windowWidth, width: windowWidth}}>
      <Image
        style={{height: windowWidth, width:windowWidth}}
        source={store.selectedPicture.source}
      />
      <TouchableOpacity
        style = {{
          position: 'absolute',
          top: h(40),
          left: h(33)
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
          top: h(43),
          right: h(33)
        }}
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



      <PostDetailsActionButtons />
    </View>

  );
});


export default PostDetailsHeader;
