import { FONTS, h, Image, observer, React, Text, TouchableOpacity, TouchableWithoutFeedback, View, windowWidth,v4, _ } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import CommentsStore from '../../mobx/stores/CommentsStore';
import StarGiversStore from '../../mobx/stores/StarGiversStore';
import WriteMessageStore from '../../mobx/stores/WriteMessageStore';
import FavoriteStore from '../../mobx/stores/FavoriteStore';
import VideoPreview from '../VideoPreview';
import PostSave from './PostSave';
import PostStar from './PostStar';
import PostTags from './PostTags';
import { COLORS, showLog } from '../../helpers';
import Post from '../../mobx/stores/Post';
import CreatePostStore from '../../mobx/stores/CreatePostStore';
import Picture from '../../mobx/stores/Picture';

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
          width: h(120),
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
            paddingLeft: h(8)
          }}
        >
          {store.numberOfTags}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: h(120),
          backgroundColor: 'transparent',
          backgroundColor:'pink'
        }}
        onPress={() => {
          console.log('New data=>'+JSON.stringify(store.post))
          // alert('New data=>'+store.post.photos[0].asset_url)
          // alert('New data=>'+store.post.pictures.tags)
          CreatePostStore.reset();
          CreatePostStore.postId = store.post.id;
          
          // let pic = {
          //   uri:store.post.photos[0].asset_url
          // } 
          // CreatePostStore.lastTakenPicture = pic;

          // let tempTags = [];

          // store.post.photos[0].labels.map((value, index) => {
          //   let tempA={
          //     'type': 'hashtag',
          //     x: value.position_top,
          //     y: value.position_left,
          //     tagId: value.id,
          //     // pic: 'Test tag',
          //     // pic: {
          //     //   key:'Name'
          //     // },
          //     hashtag: (value.tag)?value.tag.name:'Null',

          //   }
          //   tempTags.push(tempA)
          // })
          

          // let temp = {
          // source: pic,            
          // // tags: [],
          // folderName: 'post',
          // isPaused: false,
          // iaPlaying: false,
          // originalSource: pic,
          // tags:tempTags
          // // tags:store.post.photos[0].labels,
          // // tags:[{'type':'hashtag',x:store.post.photos[0].labels[0].position_top,y:store.post.photos[0].labels[0].position_left,tagId:store.post.photos[0].labels[0].id,name:'Nimisha'}],
          // }
          // // alert(JSON.stringify(temp))
          // CreatePostStore.gallery.selectedPicture = temp;
          

          
    //////////////////////////////////////// tags formula ////////////////////////////////////////
         
     for (let pic of store.post.photos) {
        if (pic.asset_url==undefined || pic.asset_url==null){
        pic.asset_url = '';
      }
       let picObj = { uri: pic.asset_url };
       console.log('GalleryPicture=====>' + JSON.stringify(picObj))

      //  let tempSource = { source: picObj }
      //  CreatePostStore.gallery.pictures = [tempSource];
       
     
      let picture = new Picture( 
        picObj,
        picObj,
        null
      );

      picture.id = pic.id;

      if (pic.video_url) {
        picture.videoUrl = pic.video_url;
      }

      for (let item of pic.labels) {

        if (item.formulas) {

          if (item.formulas.length > 0) {
            picture.addServiceTag(item.position_left, item.position_top, item.formulas[0]);
          } else if (item.url != null) {
            picture.addLinkTag(item.position_left, item.position_top, item);

          } else {
            // picture.addHashTag(item.position_left, item.position_top, '#redken');
            if (item.tag) {
              picture.addHashTag(item.position_left, item.position_top, item.tag.name);
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

        

          // if (item.tag) {
          //   picture.tags[picture.tags.length - 1].tagId = item.tag.id;
          // }

          // if (item.id) {
          //   picture.tags[picture.tags.length - 1].id = item.id;
          // }
        }
      }
      
       
      // let tempSource ={"asset_url":picObj,"tags":[{"position_left":55,"position_top":101,"tag_id":117}]}
      //  let tempSource = { "source": picObj, "tags": picture.tags }
       let tempSource = { "asset_url": picObj.uri, "labels_attributes": picture.tags }
       CreatePostStore.gallery.bind_products = store.post.products;
      CreatePostStore.gallery.pictures = [tempSource];

   
      //   for (key in picture) {
      //     showLog("Nimisha store displayPicData ==>" + key + " value ==>" + JSON.stringify(picture[key]));
      //     // if (key == 'tags') {
      //     //   for (iKey in picture[key]) {
      //     //     showLog("Nimisha store displayPicData ==> inner=> " + iKey + " value ==>" + picture[key][iKey]);
      //     //     // for (Key in response[key]) {
      //     //     //   showLog("Nimisha store displayPicData ==> i " + key + " value ==>" + response[key]);
      //     //     // }
      //     //   }
      //     // }
          
      //   }
      //  picture.tags.map((value, index) => {
      //    console.log("tag store displayPicData ==>"+JSON.stringify(value))
      //  })
      
       CreatePostStore.lastTakenPicture = picture;
       CreatePostStore.gallery.selectedPicture = picture;
       CreatePostStore.gallery.description = store.post.description;
      
     
       CreatePostStore.gallery.arrTakenPictures.push(CreatePostStore.lastTakenPicture);
       
       
      //  CreatePostStore.gallery.addPicture(picture)
          // CreatePostStore.addTakenPictureToGallery()
      //  setTimeout(() => {
        //  CreatePostStore.gallery.pictures.push(picture)                     
      //  },1000)
      

    }

       //////////////////////////////////////// tags formula ////////////////////////////////////////
          
          
          
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
        <Text style={{
            lineHeight: h(40),
            color: 'white',
            fontSize: h(30),
            fontFamily: FONTS.LIGHT,
            paddingLeft: h(8)
          }}>Edit</Text>
      </TouchableOpacity>
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

      <View style={{ height: windowWidth * (4 / 3), width: windowWidth }}>
        {
          store.selectedPicture.isVideo ?
            <VideoPreview picture={store.selectedPicture} post={post} /> :
            <Image
              style={{ height: windowWidth * (4 / 3), width: windowWidth, flex: 1 }}
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
