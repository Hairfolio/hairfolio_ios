import { FONTS, h, Image, observer, React, Text, TouchableOpacity, TouchableWithoutFeedback, View, windowWidth,v4, _, AlertIOS } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import CommentsStore from '../../mobx/stores/CommentsStore';
import StarGiversStore from '../../mobx/stores/StarGiversStore';
import WriteMessageStore from '../../mobx/stores/WriteMessageStore';
import FavoriteStore from '../../mobx/stores/FavoriteStore';
import VideoPreview from '../VideoPreview';
import PostSave from './PostSave';
import PostStar from './PostStar';
import PostTags from './PostTags';
import { COLORS, showLog, showAlert, showAlertWithCallback } from '../../helpers';
import Post from '../../mobx/stores/Post';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import EditPostStore from '../../mobx/stores/EditPostStore';
import Picture from '../../mobx/stores/Picture';
import UserStore from '../../mobx/stores/UserStore';
import NewMessageStore from '../../mobx/stores/NewMessageStore';
import FeedStore from '../../mobx/stores/FeedStore';
import TempCommonStore from '../../mobx/stores/TempCommonStore';

const PostDetailsActionButtons = observer(({ store, navigator, from }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: h(24),
        bottom: h(24),
        flexDirection: 'row',
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(120),
          backgroundColor: COLORS.TRANSPARENT,
        }}
        onPress={() => {
          StarGiversStore.load(store.post.id);
          navigator.push({
            screen: 'hairfolio.StarGivers',
            navigatorStyle: NavigatorStyles.tab,
            passProps: {
              [from]: true
            }
          });
        }}
      >
        <Image
          style={{ height: h(40), width: h(43) }}
          source={store.post.starImageSourceWhite}
        />
        <Text
          style={{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5)
          }}
        >
          {store.post.starNumber}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(100),
          backgroundColor: 'transparent',
        }}
        onPress={() => {
          CommentsStore.jump(
            store.post.id,
            navigator,
            from
          );
        }}
      >
        <Image
          style={{ height: h(39), width: h(40) }}
          source={require('img/feed_white_comments.png')}
        />
        <Text
          style={{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(5)
          }}
        >
          {store.post.numberOfComments}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(100),
          backgroundColor: 'transparent',
        }}
        onPress={() => { store.showTags = !store.showTags }}
      >
        <Image
          style={{ height: h(39), width: h(40) }}
          source={store.tagImage}
        />
        <Text
          style={{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(8),
          }}
        >
          {store.numberOfTags}
        </Text>
      </TouchableOpacity>
      {(store.post.creator && (store.post.creator.id == UserStore.user.id))
      &&      
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'center',
            width: h(60),
            backgroundColor: 'transparent',
            // backgroundColor:'pink'
          }}
          onPress={() => {
            console.log('New data=>'+JSON.stringify(store.post))
            // alert('New data=>'+store.post.photos[0].asset_url)
            // alert('New data=>'+store.post.pictures.tags)
            CreatePostStore.reset();
            CreatePostStore.resetEdit();


            CreatePostStore.postId = store.post.id;
            // CreatePostStore.actual_products = [];
            CreatePostStore.actual_products = store.post.products;
          showLog("CreatePostStore.gallery.actual_products 111==> " + JSON.stringify(CreatePostStore.actual_products))
          
            let tempPicture = [];
          
      for (let pic of store.post.photos) {
          if (pic.asset_url==undefined || pic.asset_url==null){
          pic.asset_url = '';
        }
        //  let picObj = { uri: pic.asset_url, id: pic.id };
        let picObj = { uri: pic.asset_url };
        
        console.log('GalleryPicture=====>' + JSON.stringify(pic))

        //  let tempSource = { source: picObj }
        //  CreatePostStore.gallery.pictures = [tempSource];
        
          let picture = new Picture( 
            picObj,
            picObj,
            CreatePostStore.gallery
            // {'selectedPicture':picObj.uri}
          );

        picture.source = picObj;
          picture.id = pic.id;

          if (pic.video_url) {
            picture.videoUrl = pic.video_url;
          }

          for (let item of pic.labels) {

            if (item.formulas) {

              if (item.formulas.length > 0) {
                picture.addServiceTag(item.position_left, item.position_top, item.formulas[0]);
                // labels_attributes.push({"position_left": item.position_left,"position_top": item.position_top,"formulas_attributes":item.formulas[0]});
              } else if (item.url != null) {
                picture.addLinkTag(item.position_left, item.position_top, item);
                // labels_attributes.push( {"url": item.url,"name": item.name,"position_left": item.position_left,"position_top": item.position_top})
              } else {
                // picture.addHashTag(item.position_left, item.position_top, '#redken');
                if (item.tag) {
                  picture.addHashTag(item.position_left, item.position_top, item.tag.name);
                  // labels_attributes.push({"position_left": item.position_left,"position_top": item.position_top,"tag_id": item.tag.id})
                } else {
                  if (item.product_id != null) {
                    if (store.post.products.length > 0) {
                      let newObj = _.filter(store.post.products, { id: item.product_id })
                      // alert("POST ==> "+JSON.stringify(this.uniqueCode))
                      if(newObj && newObj[0]) {
                        let tempProd = {
                          "id": newObj[0].id,
                          "created_at": newObj[0].created_at,
                          "name": newObj[0].name,
                          "last_photo": newObj[0].cloudinary_url,
                          "price": newObj[0].price,
                          "final_price": newObj[0].final_price,
                          "discount_percentage": newObj[0].discount_percentage,
                          "cloudinary_url": newObj[0].cloudinary_url,
                          "product_image" : newObj[0].product_image,
                          "uniqueCode" : this.uniqueCode,
                          "product_thumb" : newObj[0].product_thumb,
                        };
                        picture.addProductTag(item.position_left, item.position_top, tempProd);
                        // labels_attributes.push({ "position_top": item.position_top, "position_left": item.position_left, "product_id": tempProd.id });
                      }
                    }
                  }
                  else {
                    let temp2 = {
                      "id": null,
                      "created_at": "null",
                      "name": "null",
                      "last_photo": "null",
                    };
                    picture.addHashTag(item.position_left, item.position_top, "");
                  }
                }
              }

              if (item.tag) {
                if(picture.tags.length > 0)
                {
                  picture.tags[picture.tags.length - 1].tagId = item.tag.id;
                }
                
              }

              if (item.id) {
                if(picture.tags.length > 0)
                {
                  picture.tags[picture.tags.length - 1].id = item.id;
                }
                
              }   
            }
          }    
          CreatePostStore.gallery.bind_products = store.post.products;
        
          CreatePostStore.lastTakenPicture = picObj;
        CreatePostStore.gallery.selectedPicture = picture;
        
        CreatePostStore.gallery.description = store.post.description;     
        CreatePostStore.gallery.addPicture(picture)
        
          CreatePostStore.gallery.arrTakenPictures.push(CreatePostStore.lastTakenPicture);
          CreatePostStore.gallery.arrSelectedImages.push(CreatePostStore.gallery.selectedPicture)
      }   
            
            
            navigator.push({
              screen: 'hairfolio.Gallery',
              navigatorStyle: NavigatorStyles.tab,
              passProps: {
                fromScreen:'EditPost',
                [from]: true
              }
            });
          }}
        >
          <Image style={{ height: h(39), width: h(40),tintColor:COLORS.WHITE }} source={require('img/edit.png')} />
        </TouchableOpacity>
      }

      {(store.post.creator && (store.post.creator.id == UserStore.user.id))
          &&
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent:'center',
              width: h(60),
              marginLeft:15,
              paddingLeft:10,
              backgroundColor: 'transparent',
              // position: 'absolute',
              // top: h(23),
              // right: h(110),
              // paddingHorizontal: h(20),
              // paddingVertical: h(13)
            }}
            onPress={
              async() => {
                AlertIOS.alert(
                  'Delete Post',
                  'Are you sure you want to delete this post?',
                  [
                    { text: 'Yes', onPress: async() => {
                      let res = await store.post.deletePost();
                      console.log("RES!! ==> " + JSON.stringify(res))
                      if(res) {
                        if(res.error) {
                          alert(res.error)
                        } else {
                          // showAlertWithCallback('Post deleted successfully.', () => {
                            FeedStore.reset();
                            NewMessageStore.load();
                            FeedStore.load();
                            FeedStore.hasLoaded = true;
                            store.back();
                          // }); 
                        }  
                      }   
                    }},

                    { text: 'No', onPress: () => showLog('Cancel Pressed') },
                  ],
                );                        
              }
            }
          >
            <Image
              style={{
                // height: h(27),
                // width: h(43),
                width: h(40),
                tintColor:'white'
              }}
              source={require('img/bin.png')}
            />
          </TouchableOpacity>
        }
    </View>
  );
});

const PostDetailsHeader = observer(({ store, navigator, from }) => {
  const placeholder_icon = require('img/medium_placeholder_icon.png');
  let post = store.post;
  let arr_product = post.products;
  
  return (
    <TouchableWithoutFeedback
      onPress={
        async (e) => {
          from = from;
          let data = e.touchHistory.touchBank[1];
          let timeDiff = data.currentTimeStamp - data.previousTimeStamp;

          let currentClickTime = (new Date()).getTime();

          let time = currentClickTime;

          let oneClickFun = () => {
            if (time == post.lastClickTime && !post.doubleClick) {
            } else {
              post.doubleClick = false;
            }
          };

          if (post.lastClickTime) {
            let diff = currentClickTime - post.lastClickTime;

            if (diff < 300) {

              post.doubleClick = true;

              let b2 = await post.starPost();
              showLog("cool ==>" + JSON.stringify(b2));
              let post2 = new Post();
              await post2.init(b2.like.post);
              FavoriteStore.elements.push(post2);

            } else {
              setTimeout(oneClickFun, 350);
            }
          } else {
            setTimeout(oneClickFun, 350);
          }

          post.lastClickTime = currentClickTime;
        }}
      onLongPress={(e) => {
        post.savePost();
      }}
    >

      <View style={{ height: windowWidth * (4 / 2.7), width: windowWidth }}>
        {
          store.selectedPicture.isVideo ?
            <VideoPreview picture={store.selectedPicture} post={post} /> :
            <Image
              style={{ height: windowWidth * (4 / 2.7), width: windowWidth, flex: 1 }}
              defaultSource={placeholder_icon}
              source={(store.selectedPicture) ? store.selectedPicture.getSource(2 * windowWidth, 2 * windowWidth) : placeholder_icon}
            // source={store.imageToDisplay}
            />
        }

        <TouchableOpacity
          style={{
            zIndex: 999999,
            position: 'absolute',
            top: h(20),
            paddingVertical: h(20),
            left: h(13),
            paddingHorizontal: h(20),
          }}
          onPress={() => store.back()}
        >
          <Image
            style={{ height: h(29), width: h(42) }}
            source={require('img/feed_white_arrow_back.png')}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: h(23),
            right: h(13),
            paddingHorizontal: h(20),
            paddingVertical: h(20)
          }}
          onPress={
            () => {


              WriteMessageStore.navigator = navigator;
              WriteMessageStore.mode = 'POST';
              WriteMessageStore.post = post;

              navigator.push({
                  screen: 'hairfolio.WriteMessage',
                  navigatorStyle: NavigatorStyles.basicInfo,
                  title: WriteMessageStore.title,
                  passProps: {
                    from_search: true
                  }
                });

              // if (from == 'from_feed') {
              //   navigator.push({
              //     screen: 'hairfolio.WriteMessage',
              //     navigatorStyle: NavigatorStyles.basicInfo,
              //     title: WriteMessageStore.title,
              //     passProps: {
              //       from_feed: true
              //     }
              //   });
              // } else if (from == 'from_search') {
              //   navigator.push({
              //     screen: 'hairfolio.WriteMessage',
              //     navigatorStyle: NavigatorStyles.basicInfo,
              //     title: WriteMessageStore.title,
              //     passProps: {
              //       from_search: true
              //     }
              //   });
              // } else if (from == 'from_profile') {
              //   navigator.push({
              //     screen: 'hairfolio.WriteMessage',
              //     navigatorStyle: NavigatorStyles.basicInfo,
              //     title: WriteMessageStore.title,
              //     passProps: {
              //       from_profile: true
              //     }
              //   });

              // }
            }
          }
        >
          <Image
            style={{
              height: h(27),
              width: h(43)
            }}
            source={require('img/feed_white_share_btn.png')}
          />
        </TouchableOpacity>

        <PostTags store={store} arr_product={arr_product} navigator={navigator} />
        <PostDetailsActionButtons store={store} navigator={navigator} from={from} />
        <PostSave post={post} />
        <PostStar post={post} />
      </View>
    </TouchableWithoutFeedback>
  );
});


export default PostDetailsHeader;
