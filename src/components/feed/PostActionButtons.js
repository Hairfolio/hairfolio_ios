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
  ActionSheetIOS,
  PickerIOS, Picker, StatusBar, Platform, View, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, StyleSheet
} from 'hairfolio/src/helpers.js';

import StarGiversStore from 'stores/StarGiversStore'
import CommentsStore from 'stores/CommentsStore'

import Communications from 'react-native-communications';

import {starGivers, comments, appStack} from '../../routes';
var KDSocialShare = require('NativeModules').KDSocialShare;

import * as routes from 'hairfolio/src/routes';

import PostDetailStore from 'stores/PostDetailStore'

const PostActionButtons = observer(({post}) => {

  let openMore = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Share to Facebook', 'Share to Twitter', 'Report', 'Cancel'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3,
    },
    (buttonIndex) => {
      if (buttonIndex == 0) {
        // share on facebook
        KDSocialShare.shareOnFacebook({
          'text':'Check out this new hairfolio post!',
          'link':'https://hairfolio.com',
          'imagelink':'http://res.cloudinary.com/hjqlqfq3w/image/upload/v1478171301/hair_z1v47e.png',
        },
          (results) => {
            console.log(results);
          }
        );
      } else if (buttonIndex == 1) {
        // share on twitter
        KDSocialShare.tweet({
          'text':'Check out this new hairfolio post!',
          'link':'https://hairfolio.com/',
          'imagelink':'http://res.cloudinary.com/hjqlqfq3w/image/upload/v1478171301/hair_z1v47e.png',
        },
        (results) => {
          console.log(results);
        });
      } else if (buttonIndex == 2) {
        // report abuse
        Communications.email(['report@hairfolio.com'], null, null, 'Abusive Post', 'The post from  ' + post.creator.name + ', created on ' + post.createdTime + ' is abusive, please check.')
      }
    });
  }

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
      <TouchableOpacity
        onPress={() => {
          StarGiversStore.back = () => window.navigators[0].jumpTo(appStack);
          window.navigators[0].jumpTo(starGivers);
        }}
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
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          CommentsStore.back = () => window.navigators[0].jumpTo(appStack);
          window.navigators[0].jumpTo(comments);
        }}
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
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginRight: h(50)
        }}

        onPress={ () => {
          PostDetailStore.post = post;
          PostDetailStore.showTags = true;
          window.navigators[0].jumpTo(routes.postDetails);
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
      </TouchableOpacity>

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
      <TouchableOpacity
        onPress={openMore}
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
      </TouchableOpacity>

    </View>

  );
});


export default PostActionButtons;
