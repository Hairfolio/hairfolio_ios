import { h, observer, React, ScrollView } from '../../helpers';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import PostDescription from './PostDescription';
import PostDetailsColorFormula from './PostDetailsColorFormula';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsImageList from './PostDetailsImageList';
import PostHeader from './PostHeader';

const SharePostContent = observer(({navigator, from, dataPost}) => {

//   if (PostDetailStore.isEmpty) {
//     return null;
//   }
  let value = dataPost;
  return (
    
    <ScrollView
      ref={el => {value.scrollView = el}}
      scrollEventThrottle={16}
      onScroll={async (e) => {
      }}
    >
      {/* <PostHeader
        post={value.post}
        navigator={navigator}
      /> */}
      <PostDetailsHeader
        store={value}
        navigator={navigator}
        from={from}
      />
      <PostDetailsImageList
        store={value}        
      />
      <PostDescription
        style={{paddingTop: h(28)}}
        post={value.post}
        navigator={navigator}
      />
      {/* <PostDetailsColorFormula
        store={value}
        navigator={navigator}
      /> */}
    </ScrollView>
  );
});

export default SharePostContent;
