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
import { toJS } from 'mobx';
import utils from '../../utils';
import NavigatorStyles from '../../common/NavigatorStyles';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import TagPostStore from '../../mobx/stores/TagPostStore';
import CommentsStore from '../../mobx/stores/CommentsStore';
import EnvironmentStore from '../../mobx/stores/EnvironmentStore';
import UserStore from '../../mobx/stores/UserStore';
const PostHeader = observer(({post, navigator}) => {  
  // console.log("User ==>"+JSON.stringify(UserStore.user))
  // console.log("HEADER ==>"+JSON.stringify(post))
  var user = UserStore.user;

  if(user.id == post.creator.id){
    if(user.account_type == "owner"){
      if(user.salon){
        if(user.first_name && user.last_name){
          
        }else{
          post.creator.name = user.salon.name;
        }
      }
    }

  }
  
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: post.creator.id,
            from_feed:true
          }
        });
      }}
    >
      <View
        style={{
          height: h(110),
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center'
        }}>

        <Image
          style={{height: h(70), width: h(70), borderRadius: h(70) / 2, marginLeft: h(13)}}
          source={post.creator.pictureUrl}
        />
        <Text
          style={{
            color: '#3C3C3C',
            fontFamily: FONTS.MEDIUM,
            fontSize: h(30),
            paddingLeft: h(20),
            flex: 1
          }}
          numberOfLines={2}
        >
          {post.creator.name}
        </Text>
        <Text
          style={{
            fontSize: h(30),
            color: '#D8D8D8',
            fontFamily: FONTS.ROMAN,
            marginRight: h(22),
            marginLeft: h(22)
          }}
        >
          {post.getTimeDifference()}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default PostHeader;
