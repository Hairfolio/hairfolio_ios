import { Image, observer, React, ScrollView, TouchableWithoutFeedback, windowWidth } from 'Hairfolio/src/helpers';

const PostDetailsImage = observer(({store, picture, index}) => {
  const placeholder_icon = require('img/medium_placeholder_icon.png');
  return (
    <TouchableWithoutFeedback
      onPress={
        () =>  store.selectIndex(index)
      }
    >
      <Image
        style={{height: windowWidth / 4, width: windowWidth / 4, borderWidth: 1, borderColor: 'white', flex:1}}
        defaultSource={placeholder_icon}
        source={(picture.source) ? picture.source : placeholder_icon}
      />
    </TouchableWithoutFeedback>

  );
});

const PostDetailsImageList = observer(({store}) => {
  return (
    <ScrollView
      bounces={false}
      style={{height: windowWidth / 4, width: windowWidth}}
      horizontal
    >
      {store.post.pictures.map(
        (e, index) => <PostDetailsImage store={store} key={e.key} index={index} picture={e} />
      )}
    </ScrollView>
  );
});

export default PostDetailsImageList;
