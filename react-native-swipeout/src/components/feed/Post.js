import { COLORS, h, observer, React, ScrollView, View } from '../../helpers';
import PostActionButtons from './PostActionButtons';
import PostDescription from './PostDescription';
import PostHeader from './PostHeader';
import PostPicture from './PostPicture';
import ProductPostList from './ProductPostList';

const Post = observer(({ post,navigator }) => {  
  return (
    <View>
      <View style={{ height: h(0), backgroundColor: COLORS.LIGHT, flex: 1 }} />
      <PostHeader post={post} navigator={navigator} />
      <PostPicture post={post} navigator={navigator} />

      {
        (post.isShopShow)?
        <PostActionButtons post={post} 
          isShowClicked = {!post.isShopShow}
          navigator={navigator} />

          :

          <PostActionButtons post={post} 
          isShowClicked={!post.isShopShow}
          navigator={navigator} />
      } 
   

    {
        (!post.isShopShow)?
        <ProductPostList post={post} navigator={navigator} />
        :
        null
    }   
      <PostDescription limitLinesNumbers currentRoute={null} post={post} navigator={navigator} />

    </View>
  );
});

export default Post;

