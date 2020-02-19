import { FONTS, h, Image, observer, React, Text, TouchableWithoutFeedback, View, windowWidth } from 'Hairfolio/src/helpers';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import { COLORS, showLog, windowHeight } from '../../helpers';
import NavigatorStyles from '../../common/NavigatorStyles';

const ActionButtons = observer(({post}) => {
  return (
    <View
      style = {{
        position: 'absolute',
        left: h(18),
        bottom: h(18),
        flexDirection: 'row',
      }}
    >
      <View
        style = {{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(120),
        }}
      >
        <Image
          style={{height: h(40), width: h(43)}}
          source={(post) && post.starImageSourceWhite}
        />
        <Text
          style = {{
            lineHeight: h(40),
            color: COLORS.WHITE,
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5),
            backgroundColor: COLORS.TRANSPARENT
          }}
        >
          {(post) && post.starNumber}
        </Text>
      </View>

      <View
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
            color: COLORS.WHITE,
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5),
            backgroundColor: COLORS.TRANSPARENT
          }}
        >
          {(post) && post.numberOfComments}
        </Text>
      </View>

    </View>
  );
});

const PostHeader = observer(({post, navigator}) => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={{
          height: h(110),
          width: windowWidth,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
        }}>

        <Image
          style={{height: h(70), width: h(70), borderRadius: h(70) / 2, marginLeft: h(13)}}
          defaultSource={require('img/stylist.png')}
          source={(post && post.creator && post.creator.pictureUrl && post.creator.pictureUrl.uri!=undefined) ? post.creator.pictureUrl : require('../../../resources/img/stylist.png')}
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
          {(post && post.creator) && post.creator.name}
        </Text>
      </View> 
    </TouchableWithoutFeedback>
  );
  
});

const TrendingGridPost = observer(({post, navigator, from}) => {
  
  const windowEdge = Math.round((windowWidth / 2)-20);
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
          PostDetailStore.jump(
            false,
            post,
            navigator,
            from
          );
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
          defaultSource={require("img/medium_placeholder_icon.png")}
          source={(post && post.pictures)? post.pictures[0].getSource(windowEdge, windowEdge) : require("img/medium_placeholder_icon.png")}
        />
        <ActionButtons post={post} />
        <PostHeader post={post} />
       
      </View>
    </TouchableWithoutFeedback>
  );
});

export default TrendingGridPost;
