import { h, Image, observer, React, View, windowWidth } from 'Hairfolio/src/helpers';

const PostStar = observer(({post}) => {

  if (!post.showStar) {
    return null;
  }

  return (
    <View
      style={{
        height: windowWidth,
        width: windowWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    <Image
      style={{
        height: h(221),
        width: h(223),
        opacity: 0.73
      }}
      source={require('img/feed_action_star.png')}
    />
    </View>
  );
});


export default PostStar;
