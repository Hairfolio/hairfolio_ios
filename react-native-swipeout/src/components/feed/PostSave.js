import { h, Image, observer, React, View, windowWidth } from 'Hairfolio/src/helpers';

const PostSave = observer(({post}) => {

  if (!post.showSave) {
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
        height: h(265),
        width: h(265),
        opacity: 0.73
      }}
      source={require('img/feed_action_save.png')}
    />
    </View>
  );
});

export default PostSave;
