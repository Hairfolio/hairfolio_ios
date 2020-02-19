import { h, observer, React, ScrollView, Text, View, windowHeight, windowWidth, COLORS } from '../../helpers';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import PostDescription from './PostDescription';
import PostDetailsColorFormula from './PostDetailsColorFormula';
import PostDetailsHeader from './PostDetailsHeader';
import PostDetailsImageList from './PostDetailsImageList';
import PostHeader from './PostHeader';
import { FONTS } from '../../style';

const PostDetailsContent = observer(({ navigator, from }) => {

  if (PostDetailStore.isEmpty) {
    return null;
  }
  let value = PostDetailStore.currentStore;
  // alert("POST DETAILS COMPONENT ==> "+JSON.stringify(value.post))
  // let unique_code = PostDetailStore.unique_code;
  return (
    
    <ScrollView
      ref={el => {value.scrollView = el}}
      scrollEventThrottle={16}
      onScroll={async (e) => {
      }}
    >
        {(value.post && value.post.isDeleting)
          ?
            <View style={{ elevation: 999, zIndex:999999, position:'absolute', height:windowHeight, width:windowWidth, justifyContent:'center', alignItems:'center'}}>
              <View style={{ backgroundColor: COLORS.BLACK, opacity:0.7}}>
                <Text style={{padding:10, fontFamily:FONTS.MEDIUM, color:COLORS.WHITE, fontSize:16, alignSelf:'center'}}>{'Deleting...'}</Text>
              </View>
            </View>
          :
          null
        }
      <PostHeader
        post={value.post}
        navigator={navigator}
      />
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
        // unique_code={unique_code}
      />
      <PostDetailsColorFormula
        store={value}
        navigator={navigator}
      />
    </ScrollView>
  );
});

export default PostDetailsContent;
