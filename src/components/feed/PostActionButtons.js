import {
  _, // lodash
  v4,
  observer, // mobx
  h,
  FONTS,
  COLORS,
  autobind,
  Alert,
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
} from 'Hairfolio/src/helpers';
import ServiceBackend from '../../backend/ServiceBackend';
import StarGiversStore from '../../mobx/stores/StarGiversStore';
import CommentsStore from '../../mobx/stores/CommentsStore';
import WriteMessageStore from '../../mobx/stores/WriteMessageStore';
import Communications from 'react-native-communications';
import FeedStore from '../../mobx/stores/FeedStore';
import SearchStore from '../../mobx/stores/SearchStore';
import { NativeModules } from 'react-native';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
const KDSocialShare = NativeModules.KDSocialShare;
import NavigatorStyles from '../../common/NavigatorStyles';
import UserStore from '../../mobx/stores/UserStore';

const PostActionButtons = observer(({post, navigator}) => {

  let openMore = () => {
    let imageLink =  post.pictures[0].source.uri;
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Report', 'Block User', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
    },
    (buttonIndex) => {
      if (buttonIndex == 0) {
        // report abuse
        Communications.email(['stephen@hairfolioapp.com'], null, null, 'Abusive Post', 'The post from  ' + post.creator.name + ', created on ' + post.createdTime + ' is abusive, please check. id: ' + post.id)
      } else if (buttonIndex == 1) {

        ServiceBackend.post(`users/${post.creator.id}/blocks`).then(() => {

          Alert.alert('User Blocked', 'The user has been successfully blocked');

          FeedStore.reset();
          FeedStore.load();
          SearchStore.reset();
        });
      }
    });
  }
  
  var isDifferentUser = true;

  var user = UserStore.user;
  if(user.id === post.creator.id){
    isDifferentUser = false;
  }

  if(isDifferentUser){

    return (
      <View
        style={{
          height: h(100),
          flexDirection: 'row',
          paddingLeft: h(31),
          alignItems: 'center',
          borderBottomWidth: h(2),
          borderBottomColor: '#C1C1C1'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            StarGiversStore.load(post.id);
            navigator.push({
              screen: 'hairfolio.StarGivers',
              navigatorStyle: NavigatorStyles.tab,
            });
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
            CommentsStore.jump(post.id, navigator);
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
            marginRight: h(25)
          }}
          onPress={ () => {
  
            PostDetailStore.jump(
              true,
              post,
              navigator,
            );
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
  
        <TouchableOpacity
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
          style={{
            flexDirection: 'row',
            flex: 1,
            paddingLeft: h(25),
            height: h(100),
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              height: h(26),
              width: h(46),
            }}
            source={require('img/feed_share.png')} />
        </TouchableOpacity>


          <TouchableOpacity
            onPress={openMore}
            style={{
              flexDirection: 'row',
              paddingLeft: h(15),
              paddingRight: h(31),
              height: h(100),
              alignItems: 'center'
            }}
          >
            <Image
              style={{
                height: h(13),
                width: h(59)
              }}
              source={require('img/feed_more.png')} />
          </TouchableOpacity>

      </View>
  
    );

  }else{
    return (
      <View
        style={{
          height: h(100),
          flexDirection: 'row',
          paddingLeft: h(31),
          alignItems: 'center',
          borderBottomWidth: h(2),
          borderBottomColor: '#C1C1C1'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            StarGiversStore.load(post.id);
            navigator.push({
              screen: 'hairfolio.StarGivers',
              navigatorStyle: NavigatorStyles.tab,
            });
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
            CommentsStore.jump(post.id, navigator);
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
            marginRight: h(25)
          }}
          onPress={ () => {
  
            PostDetailStore.jump(
              true,
              post,
              navigator,
            );
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
  
        <TouchableOpacity
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
          style={{
            flexDirection: 'row',
            flex: 1,
            paddingLeft: h(25),
            height: h(100),
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              height: h(26),
              width: h(46),
            }}
            source={require('img/feed_share.png')} />
        </TouchableOpacity>        
      </View>
  
    );
  }

  
});


export default PostActionButtons;
