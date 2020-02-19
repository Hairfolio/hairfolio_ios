import { FONTS, h, Image, observer, React, Text, TouchableWithoutFeedback, View, windowWidth } from 'Hairfolio/src/helpers';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import { COLORS, showLog } from '../../helpers';

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
          source={post.starImageSourceWhite}
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
          {post.starNumber}
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
          {post.numberOfComments}
        </Text>
      </View>

    </View>
  );
});

const GridPost = observer(({post, navigator, from}) => {
  const placeholder_icon = require('img/medium_placeholder_icon.png');
  const windowEdge = Math.round(windowWidth / 2);
  showLog('Current new post=>'+JSON.stringify(post))
  return (
    
    <TouchableWithoutFeedback
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
          width: windowWidth / 2,
          height: windowWidth/1.3
        }}
      >
        <Image
          style={{
            width: windowWidth / 2,
            height: windowWidth/1.3,
            flex:1
          }}
          defaultSource={placeholder_icon}
          source={(post.pictures[0])? post.pictures[0].getSource(windowEdge, windowEdge) : placeholder_icon}
        />
        <ActionButtons post={post} />
      </View>
    </TouchableWithoutFeedback>
  );
});

export default GridPost;
