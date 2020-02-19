import { NativeModules, StyleSheet } from 'react-native';
import Communications from 'react-native-communications';
import ServiceBackend from '../../backend/ServiceBackend';
import NavigatorStyles from '../../common/NavigatorStyles';
import { ActionSheetIOS, Alert, COLORS, FONTS, h, Image, observer, React, Text, TouchableOpacity, View, showLog, showAlert } from '../../helpers';
import CommentsStore from '../../mobx/stores/CommentsStore';
import FeedStore from '../../mobx/stores/FeedStore';
import PostDetailStore from '../../mobx/stores/PostDetailStore';
import SearchStore from '../../mobx/stores/SearchStore';
import StarGiversStore from '../../mobx/stores/StarGiversStore';
import UserStore from '../../mobx/stores/UserStore';
import WriteMessageStore from '../../mobx/stores/WriteMessageStore';
import ShareStore from '../../mobx/stores/ShareStore';
import Marker from 'react-native-image-marker';
// import QRCode from 'react-native-qrcode-svg';
import { BASE_URL } from '../../constants';
import {QRreader, QRscanner} from 'react-native-qr-scanner';

import PostStore from '../../mobx/stores/PostStore';
const KDSocialShare = NativeModules.KDSocialShare;
// let QRGenerator = NativeModules.QRGenerator;

const { QRGenerator, RNInstagramShare, testInternet } = NativeModules

let editedImageCount = 0;
let sharableImageArr = [];

const PostActionButtons = observer(({ post, isShowClicked, navigator }) => {

  // let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
  let shareUrl = BASE_URL+`view_post_meta/${post.id}`;


  setTextToImage = async (backGroundUrl,qrUrl, i) => {

    
    showLog("NUMBER OF TIMES IN QRCODE LOOP ==> " + i + backGroundUrl)
    // let uri = url 
    return await Marker.markImage({
      src: backGroundUrl,
      markerSrc: qrUrl, // icon uri
      position:'topRight',
      // X:200,
      // Y:200,
      scale: 1, // scale of bg
      markerScale: 0.5, // scale of icon
      quality: 100 // quality of image
    })
      .then((path) => {

       showLog("Path to image marker => "+JSON.stringify(path))
       sharableImageArr.push(path)
       editedImageCount++;
      
      })
      .catch((err) => {
        FeedStore.isQrLoading=false;
        alert("Failed to edit image"+ err)
      })

  }



  let getDataURL = (url) =>{
    
    showLog("GET DATA URL"+url)
    let shareUrl1 = url;
    showLog("LINK URL ==>"+shareUrl1)
    // QRGenerator.addEvent('a','b')

    sharableImageArr = []

    QRGenerator.addEvent(shareUrl1, function (o) {

      console.log("+++++++++++++++++++++++++++++++++++")
      console.log('IN Call back')
      console.log(o)
      
      let imageArray = WriteMessageStore.currentPost.photos;
      let old_count = imageArray.length

      showLog("IMAGE ARRAY ==> "+JSON.stringify(WriteMessageStore.currentPost.photos))
      
      imageArray.map(async (obj, i) => {

        showLog("IN SELECTD ARRAY MAPPING ==> "+JSON.stringify(obj.asset_url))
        await setTextToImage(obj.asset_url,o,i)

        if(old_count == editedImageCount)
        {
          showLog("COUNT MATCHED ==> "+sharableImageArr)
          FeedStore.isQrLoading = false;
          // FeedStore.showInstaLoader = false;
          sharableImageArr.reverse();
          sharableImageArr.map(async (obj, i) => {
            QRGenerator.shareToInstagram(obj);
          })
          editedImageCount = 0;
        }

      })

      // alert(o)
      console.log("+++++++++++++++++++++++++++++++++++")

    }) 

}

sharingOptionDialog = (post_Id)=>{

  
  showLog(BASE_URL+`view_post_meta/${WriteMessageStore.currentPostId}`);

    ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Share', 'Share With QR on Instagram','Cancel'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 2,
    },
    async (buttonIndex) => {
      if (buttonIndex === 0) {
        /* destructive action */

        testInternet.testMethod((o)=>{

          if(o==true)
          {
             ShareStore.shareLink(post_Id)
          }
          else
          {
            FeedStore.isQrLoading = false;
            showAlert("No Internet Connection!")
          }
        })
       
      }
      else if(buttonIndex === 1){

        testInternet.testMethod(async(o)=>{
          if(o==true)
          {
            let url = "view_post_share_unique_code/"+post_Id
            FeedStore.isQrLoading = true;
            let res = await ServiceBackend.get(url)
    
            if(res)
            {
              if(res.error)
              {
                FeedStore.isQrLoading = false;
                showAlert("Something went wrong")
              }
              else
              {
                   getDataURL(res.url)
              }
            }
          }
          else
          {
            FeedStore.isQrLoading = false;
            showAlert("Something went wrong")
          }
        })
       
      }
      else
      {
        FeedStore.isQrLoading = false;
      }
    },
  );

}


let openMore = () => {
    let imageLink = post.pictures[0].source.uri;
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Report', 'Block User', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
    },
      (buttonIndex) =>{
        if (buttonIndex == 0) {
          // report abuse
          Communications.email(['stephen@hairfolioapp.com'], null, null, 'Abusive Post', 'The post from  ' + post.creator.name + ', created on ' + post.createdTime + ' is abusive, please check. id: ' + post.id)
        } else if (buttonIndex == 1) {

          ServiceBackend.post(`users/${post.creator.id}/blocks`).then(() => {

            Alert.alert('User Blocked', 'The user has been successfully blocked');

            FeedStore.reset();
            FeedStore.load();
            SearchStore.reset();
          });
        }
      });
  }

  var isDifferentUser = true;

  var user = UserStore.user;
  if (user.id === post.creator.id) {
    isDifferentUser = false;
  }

  if (isDifferentUser) {

    return (
      <View
        style={{
          height: h(100),
          flexDirection: 'row',
          paddingLeft: h(31),
          alignItems: 'center',
          borderBottomWidth: h(2),
          borderBottomColor: COLORS.BORDER_BOTTOM
        }}
      >
        <TouchableOpacity
          onPress={() => {
            StarGiversStore.load(post.id);
            navigator.push({
              screen: 'hairfolio.StarGivers',
              navigatorStyle: NavigatorStyles.tab,
              passProps: {
                from_feed: true
              }
            });
          }}
          style={{
            flexDirection: 'row',
            marginRight: h(50)
          }}
        >
          <Image
            style={{
              height: h(40),
              width: h(43),
              marginRight: h(15)
            }}
            source={post.starImageSource} />
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.LIGHT,
              color: COLORS.TEXT_COMMENT
            }}
          >
            {post.starNumber}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            
            CommentsStore.jump(post.id, navigator, 'from_feed');
          }}

          style={{
            flexDirection: 'row',
            marginRight: h(50)
          }}
        >
          <Image
            style={{
              height: h(39),
              width: h(51),
              marginRight: h(15),
              marginTop: h(3)
            }}
            source={require('img/feed_comments.png')} />
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.LIGHT,
              color: COLORS.TEXT_COMMENT
            }}
          >
            {(PostStore.isComment) ? post.numberOfComments:post.numberOfComments}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginRight: h(25)
          }}
          onPress={() => {

            PostDetailStore.jump(
              true,
              post,
              navigator,
              'from_feed'
            );
          }}
        >
          <Image
            style={{
              height: h(38),
              width: h(38),
              marginRight: h(15),
              marginTop: h(3)
            }}
            source={require('img/feed_tags.png')} />
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.LIGHT,
              color: COLORS.TEXT_COMMENT
            }}
          >
            {post.numberOfTags}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => {

              WriteMessageStore.navigator = navigator;
              WriteMessageStore.mode = 'POST';
              WriteMessageStore.post = post;
              // ShareStore.shareLink(post.id)
              WriteMessageStore.currentPostId = post.id;
              WriteMessageStore.currentPost = post;
              testInternet.testMethod((o)=>{
                if(o==true)
                {
                  sharingOptionDialog(post.id);
                }
                else
                {
                  showAlert("No Internet Connection!")
                }
              })
              
            }
          }
          style={{
            flexDirection: 'row',
            paddingLeft: h(25),
            height: h(100),
            alignItems: 'center',

          }}
        >
          <Image
            style={{
              height: h(26),
              width: h(46),
            }}
            source={require('img/feed_share.png')} />
        </TouchableOpacity>

        {/* SHOW MORE */}
        <TouchableOpacity
          onPress={
            () => {
              isShowClicked = !isShowClicked;
              post.isShopShow = !post.isShopShow;

            }
          }
          style={(post.products.length > 0) ?
            styles.viewClickStyle :
            { height: 0 }}
        >
          <Text style={styles.productName}> {(!isShowClicked) ? "Shop" : "X"} </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={openMore}
          style={{
            flexDirection: 'row',
            paddingLeft: h(15),
            paddingRight: h(31),
            height: h(100),
            alignItems: 'center',
            alignSelf: 'flex-end'
          }}
        >
          <Image
            style={{
              height: h(13),
              width: h(59)
            }}
            source={require('img/feed_more.png')} />
        </TouchableOpacity>
      </View>

    );

  } else {

    return (
      <View
        style={{
          height: h(100),
          flexDirection: 'row',
          paddingLeft: h(31),
          alignItems: 'center',
          borderBottomWidth: h(2),
          borderBottomColor: '#C1C1C1'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            StarGiversStore.load(post.id);
            navigator.push({
              screen: 'hairfolio.StarGivers',
              navigatorStyle: NavigatorStyles.tab,
            });
          }}
          style={{
            flexDirection: 'row',
            marginRight: h(50)
          }}
        >
          <Image
            style={{
              height: h(40),
              width: h(43),
              marginRight: h(15)
            }}
            source={post.starImageSource} />
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.LIGHT,
              color: COLORS.TEXT_COMMENT
            }}
          >
            {post.starNumber}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            CommentsStore.jump(post.id, navigator, 'from_search');
          }}

          style={{
            flexDirection: 'row',
            marginRight: h(50)
          }}
        >
          <Image
            style={{
              height: h(39),
              width: h(51),
              marginRight: h(15),
              marginTop: h(3)
            }}
            source={require('img/feed_comments.png')} />
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.LIGHT,
              color: COLORS.TEXT_COMMENT
            }}
          >
            {post.numberOfComments}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginRight: h(25)
          }}
          onPress={() => {

            PostDetailStore.jump(
              true,
              post,
              navigator,
              'from_feed'
            );
          }}
        >
          <Image
            style={{
              height: h(38),
              width: h(38),
              marginRight: h(15),
              marginTop: h(3)
            }}
            source={require('img/feed_tags.png')} />
          <Text
            style={{
              fontSize: h(30),
              fontFamily: FONTS.LIGHT,
              color: COLORS.TEXT_COMMENT
            }}
          >
            {post.numberOfTags}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => {

              WriteMessageStore.navigator = navigator;
              WriteMessageStore.mode = 'POST';
              WriteMessageStore.post = post;
              
              // ShareStore.shareLink(post.id)
              WriteMessageStore.currentPostId = post.id;
              WriteMessageStore.currentPost = post;

              testInternet.testMethod((o)=>{
                if(o==true)
                {
                  sharingOptionDialog(post.id);
                }
                else
                {
                  showAlert("No Internet Connection!")
                }
              })
              // sharingOptionDialog(post.id);

              // navigator.push({
              //   screen: 'hairfolio.WriteMessage',
              //   navigatorStyle: NavigatorStyles.basicInfo,
              //   title: WriteMessageStore.title,
              // });

            }
          }
          style={{
            flexDirection: 'row',
            paddingLeft: h(25),
            height: h(100),
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              height: h(26),
              width: h(46),
            }}
            source={require('img/feed_share.png')} />
        </TouchableOpacity>
        {/* SHOW MORE */}
        <TouchableOpacity
          onPress={
            () => {
              isShowClicked = !isShowClicked;
              post.isShopShow = !post.isShopShow;
            }
          }
          style={(post.products.length > 0) ?
            styles.viewClickStyle :
            { height: 0 }}
        >
          <Text style={styles.productName}> {(!isShowClicked) ? "Shop" : "X"} </Text>
        </TouchableOpacity>
        
      </View>

    );
  }
});

const styles = StyleSheet.create({

  viewClickStyle: {
    marginLeft: 10,
    height: h(70),
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    borderColor: "rgba(190,190,190,1)",
    borderRadius: 5,
    borderWidth: 0.5,
    marginLeft: 15,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  productName: {
    color: "rgba(190,190,190,1)",
    fontFamily: FONTS.MEDIUM,
    fontSize: h(25),
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor:'green'
    // backgroundColor: '#000'
  }
});

export default PostActionButtons;
