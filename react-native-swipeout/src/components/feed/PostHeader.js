import { FONTS, h, Image, observer, React, Text, TouchableWithoutFeedback, View } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import UserStore from '../../mobx/stores/UserStore';
import { COLORS, showLog } from '../../helpers';

const PostHeader = observer(({post, navigator}) => {  
  const placeholder_icon = require('img/stylist.png');
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
          backgroundColor: COLORS.WHITE,
          flexDirection: 'row',
          alignItems: 'center'
        }}>

        <Image
          style={{height: h(70), width: h(70), borderRadius: h(70) / 2, marginLeft: h(13)}}
          defaultSource={placeholder_icon}
          source={(post.creator && post.creator.pictureUrl && post.creator.pictureUrl.uri!=undefined) ? 
                              post.creator.pictureUrl : placeholder_icon}
        />
        <Text
          style={{
            color: COLORS.BOTTOMBAR_SELECTED,
            fontFamily: FONTS.MEDIUM,
            fontSize: h(30),
            paddingLeft: h(20),
            flex: 1
          }}
          numberOfLines={2}
        >
          {(post.creator && post.creator.name != null)?post.creator.name:post.name}
        </Text>
        <Text
          style={{
            fontSize: h(30),
            color: COLORS.LIGHT4,
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
