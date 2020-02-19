import { FONTS, h, Image, observer, React, Text, TouchableWithoutFeedback, View, windowWidth } from 'Hairfolio/src/helpers';
import { COLORS, showLog, windowHeight } from '../../helpers';
import NavigatorStyles from '../../common/NavigatorStyles';

const PostHeader = observer(({post, navigator}) => {
  const placeholder_icon = require('img/stylist.png');
  return (
    // <TouchableWithoutFeedback
    //   onPress={() => {
    //     navigator.push({
    //       screen: 'hairfolio.Profile',
    //       navigatorStyle: NavigatorStyles.tab,
    //       passProps: {
    //         userId: post.creator.id,
    //         from_feed:true
    //       }
    //     });
    //   }}
    // >
      <View
        style={{
          height: h(110),
          width: windowWidth,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute'
        }}>

        <Image
          style={{height: h(70), width: h(70), borderRadius: h(70) / 2, marginLeft: h(13)}}
          defaultSource={placeholder_icon}
          source={(post && post.user && post.user.pictureUrl) ? post.user.pictureUrl : placeholder_icon}
        />
        <Text
          style={{
            color: COLORS.WHITE,
            backgroundColor: COLORS.TRANSPARENT,
            fontFamily: FONTS.MEDIUM,
            fontSize: h(28),
            paddingLeft: h(20),
            // flex: 1
          }}
          numberOfLines={2}
        >
          {(post && post.user) ? post.user.name : ''}
        </Text>
      </View>
    // </TouchableWithoutFeedback>
  );
  
});

const StylistGridPost = observer(({post, navigator, from}) => {
  const placeholder_icon = require('img/medium_placeholder_icon.png');
  return (
    
    <TouchableWithoutFeedback
      style={{                                
        borderRadius: 5,
        width:(windowWidth/2)-20,
        height:(windowWidth/2),
        alignItems:'center',
        elevation: 1,
        shadowOpacity: 0.10,
        shadowOffset: {
          height: 1.2,
          width: 1.2
        } 
      }}
      onPress={
        () => {
          navigator.push({
          screen: 'hairfolio.Profile',
          navigatorStyle: NavigatorStyles.tab,
          passProps: {
            userId: post.user.id,
            from_feed:true
          }
        });
        }
      }
    >
      <View
        style = {{
          margin:5,
          width:(windowWidth/2)-20,
          height:(windowWidth/2),
        }}
      >
       
        <Image
          style={{
            borderRadius: 5,
            width:(windowWidth/2)-20,
            height:(windowWidth/2),
            alignItems:'center',
            elevation: 1,
            shadowOpacity: 0.10,
            shadowOffset: {
              height: 1.2,
              width: 1.2
            } 
          }}
          defaultSource={placeholder_icon}
          source={(post && post.user && post.user.pictureUrl) ? post.user.pictureUrl : placeholder_icon}
        />
        <PostHeader post={post} />
      </View>
    </TouchableWithoutFeedback>
  );
});

export default StylistGridPost;
