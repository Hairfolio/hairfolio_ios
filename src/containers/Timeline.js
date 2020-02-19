import React from 'react';
import PureComponent from '../components/PureComponent';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { Image,Modal,TextInput, Text, View,StyleSheet, ScrollView, TouchableOpacity,ListView,Keyboard,Share, ActivityIndicator, StatusBar,Alert } from 'react-native';
import { windowHeight, windowWidth, h, COLORS, FONTS,showLog,moment, showAlert } from '../helpers';
import { _ } from 'Hairfolio/src/helpers';
import CreateLogStore from '../mobx/stores/CreateLogStore';
import ContactDetailsStore from '../mobx/stores/ContactDetailsStore';
import BlackHeader from '../components/BlackHeader';
import { SCALE } from '../style';
import Communications from 'react-native-communications';
import { KeyboardAwareScrollView } from '../../node_modules/react-native-keyboard-aware-scroll-view';
import NavigatorStyles from '../common/NavigatorStyles';


const TimelineRow = observer(({ item, index, onPress,onPressShare, store,onLongPress }) => {
  if(item && item.formula_note && item.formula_note.length == 0 && item.simple_note && item.simple_note.length == 0 && item.photos && item.photos.length == 0 && item.products && item.products.length == 0) {
    return null;
  }
  let placeholder_icon = require('img/medium_placeholder_icon.png');
  let photeArray = [];
  {
    item.photos.map((photoValue, photoIndex) => {
      let tempPhoto = {
        'uri':photoValue.asset_url
      }
      photeArray.push(tempPhoto);
    })
    item.products.map((productValue, productIndex) => {
      let tempPhoto = {
        'uri':productValue.product_thumb
      }
      photeArray.push(tempPhoto);
    })
  }
  return (
    <View style={{
      // backgroundColor: 'cyan',
      width: windowWidth - 35,
      alignSelf: 'center',
      borderBottomColor: COLORS.BORDER_BOTTOM,
      borderBottomWidth: 0.5,
      paddingVertical:10
    }}>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => onPress()} onLongPress={()=>onLongPress()}>
        <View style={{
          padding: 7,
          // backgroundColor: 'yellow'
        }}>
          <Text style={{ color: COLORS.TEXT, fontFamily: FONTS.ROMAN, paddingTop: 1, fontSize: SCALE.h(34) }}>{moment(item.created_at).format("DD")}</Text>
          <Text style={{color:COLORS.TEXT,fontFamily: FONTS.ROMAN,fontSize: SCALE.h(34)}}>{moment(item.created_at).format("ddd").toUpperCase()}</Text>
        </View>
        <View style={{
          flex: 1, padding: 4,
          // backgroundColor: 'pink'
        }}>
          {(item.formula_note.length > 0) &&
            <View style={{padding:3}}>
              <Text style={{ color: COLORS.NOTE_TITLE_COLOR, fontFamily: FONTS.HEAVY, fontSize: SCALE.h(36), fontWeight: '900' }}>Formula Note</Text>
              <Text numberOfLines={3} style={{ color: COLORS.BLACK1, fontFamily: FONTS.LIGHT, paddingTop: 2, fontSize: SCALE.h(32) }}>{item.formula_note[0]}</Text>
            </View>
          }
          {(item.simple_note.length > 0) &&
            <View style={{padding:3}}>
              <Text style={{ color: COLORS.NOTE_TITLE_COLOR, fontFamily: FONTS.HEAVY, fontSize: SCALE.h(36), fontWeight: '900' }}>Note</Text>
              <Text numberOfLines={3} style={{ color: COLORS.BLACK1, fontFamily: FONTS.LIGHT, paddingTop: 2, fontSize: SCALE.h(32) }}>{item.simple_note[0]}</Text>
              {/* {(item.simple_note.map((noteValue, noteIndex) => (
                (noteIndex<1) && <Text numberOfLines={3} style={{ color: COLORS.BLACK1, fontFamily: FONTS.LIGHT, paddingTop: 2, fontSize: SCALE.h(28) }}>{noteValue}</Text>
              )))} */}
            </View>
          }
          {(photeArray.length > 0) &&
            <View style={{ paddingHorizontal: 1, paddingVertical: 3, height: SCALE.w(200), flex: 1,flexDirection: 'row',}}>
            {(photeArray.length == 1) ?
              <Image
                source={{uri:photeArray[0].uri}}
                style={{ flex: 1, borderColor: COLORS.TEXT, borderWidth: 0.2, marginHorizontal: 2,resizeMode:(item.photos.length>0)?'cover':'contain' }} />
              :
              photeArray.map((pValue, pIndex) => (
                (pIndex < 3) && <Image
                  source={{uri:pValue.uri}}
                  style={{width:windowWidth/4.4,borderColor:COLORS.TEXT,borderWidth:0.2,marginHorizontal:2,resizeMode:'center'}} />
              ))
              }
            </View>
          }
        </View>
        <View style={{
          padding: 7,
          // backgroundColor: 'yellow'
        }}>
          <TouchableOpacity
            onPress={() => onPressShare() } style={{
              // padding: 7,
              marginTop:2,
              width: 30,
              height: 30,
              // backgroundColor: 'yellow',
              alignItems: 'center',
              justifyContent: 'center'
          }}>
            <Image
              source={require('img/share_note.png')}
              style={{width:15,height:15}} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const TimelineRowStatic = observer(({ item, index, onPress, store }) => {
  let placeholder_icon = require('img/medium_placeholder_icon.png');
  return (
    <View style={{
      // backgroundColor: 'cyan',
      width: windowWidth - 35,
      alignSelf: 'center',
      borderBottomColor: COLORS.BORDER_BOTTOM,
      borderBottomWidth: 0.5,
      paddingVertical:10
    }}>
      <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{alert('on object click')}}>
        <View style={{
          padding: 7,
          // backgroundColor: 'yellow'
        }}>
          <Text style={{color:COLORS.TEXT,fontFamily: FONTS.ROMAN,paddingTop:1,fontSize: SCALE.h(30)}}>18</Text>
          <Text style={{color:COLORS.TEXT,fontFamily: FONTS.ROMAN,fontSize: SCALE.h(30)}}>FRI</Text>
        </View>
        <View style={{
          flex: 1, padding: 4,
          // backgroundColor: 'pink'
        }}>
          <View style={{padding:3}}>
            <Text style={{color: COLORS.NOTE_TITLE_COLOR,fontFamily: FONTS.HEAVY,fontSize: SCALE.h(30),fontWeight:'900'}}>Formula Note</Text>
            <Text style={{color: COLORS.BLACK1,fontFamily: FONTS.LIGHT,paddingTop:2,fontSize: SCALE.h(28)}}>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</Text>
          </View>
          <View style={{padding:3}}>
            <Text style={{color: COLORS.NOTE_TITLE_COLOR,fontFamily: FONTS.HEAVY,fontSize: SCALE.h(30),fontWeight:'900'}}>Note</Text>
            <Text style={{color: COLORS.BLACK1,fontFamily: FONTS.LIGHT,paddingTop:2,fontSize: SCALE.h(28)}}>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</Text>
          </View>
          <View style={{paddingHorizontal:1,paddingVertical:3,height:SCALE.w(200),flex:1,flexDirection:'row',justifyContent:'space-between'}}>
            <Image
              defaultSource={placeholder_icon}
              // source={placeholder_icon}
              style={{flex:1,borderColor:COLORS.TEXT,borderWidth:0.2,marginHorizontal:2}} />
            <Image
              defaultSource={placeholder_icon}
              style={{flex:1,borderColor:COLORS.TEXT,borderWidth:0.2,marginHorizontal:2}} />
            <Image
              defaultSource={placeholder_icon}
              style={{flex:1,borderColor:COLORS.TEXT,borderWidth:0.2,marginHorizontal:2}} />
          </View>
        </View>
        <View style={{
          padding: 7,
          // backgroundColor: 'yellow'
        }}>
          <TouchableOpacity
            onPress={() => { alert('share icon click') }} style={{
              // padding: 7,
              marginTop:2,
              width: 25,
              height: 25,
              // backgroundColor: 'yellow',
              alignItems: 'center',
              justifyContent: 'center'
          }}>
            <Image
              source={require('img/share_note.png')}
              style={{width:15,height:15}} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const timelines = [
  {
      "id": 6,
      "formula_note": [
          "aaaaaaaaahldfjglfjgljfgldfbgfgdlfgljdfgldnskbhndkbgnkcnbkdnbhjnnkldgnbkldfgnlknfglkflgkfkgklfgnblmnlnkldfbjdljdklgjkldfdfbgdfgsfgsfgfgdfgfdggf",
          "sdfdsf",
          "sdfdsfdfbgdhhnfghdgh",
          "sdfdsfghdshdshdghdgshdsgh"
      ],
      "simple_note": [
          "dsfdsfdsf",
          "sfdsfdsdhdsfhdghdhdghdg"
      ],
      "created_at": "2019-11-30T10:47:14.264Z",
      "updated_at": "2019-11-30T10:47:14.264Z",
      "photos": [],
      "products": [
        {
            "id": 87,
            "name": "newtest new new Test",
            "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_oyv7b.png",
            "is_favourite": false,
            "is_trending": null,
            "new_arrival": null,
            "price": "5.00",
            "short_description": "fg",
            "description": "fgd",
            "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/oyv7b.png",
            "quantity": 45,
            "favourites_count": null,
            "link_url": null,
            "image_url": null,
            "cloudinary_url": null,
            "created_at": "2019-07-02T12:15:02.162Z",
            "categories": [],
            "final_price": "5.00",
            "discount_percentage": null,
            "tag": null,
            "product_brand": {
                "id": 1,
                "title": "Matrix",
                "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/matrix.png",
                "name": "Matrix"
            },
            "product_galleries": [
                {
                    "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/c9ads.png",
                    "id": 92
                },
                {
                    "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/vf8bu.png",
                    "id": 93
                },
                {
                    "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/m2fsn.png",
                    "id": 94
                }
            ],
            "hair_types": [],
            "product_types": [],
            "ingredients": [],
            "preferences": [],
            "styling_tools": [],
            "consistency_types": [],
            "collection": null,
            "shampoo": null,
            "conditioner": null,
            "styling_product": null
        }
    ]
  },
  {
      "id": 5,
      "formula_note": [
          "testing 121`212"
      ],
      "simple_note": [
          "Testing Notes",
          "Testing Notes d;fgjkldjsgdjfgkjdfgjk",
          "Testing Notes dlfgjlkdjgdfjgjffgfdgjdfghjdfshgjkldsfhgjkhdfjkghdjkfsghkjdfhgjkdfhgkjdfhsgkjdfhjkhsfgjkhdfjkdfgjksh",
          "Testing Notes kfghdhpkghopdpoihsd",
          "Testing Notes"
      ],
      "created_at": "2019-11-30T10:19:36.173Z",
      "updated_at": "2019-11-30T10:19:36.173Z",
      "photos": [],
      "products": []
  },
  {
      "id": 4,
      "formula_note": [
          "Test formula 1",
          "Test formula 2"
      ],
      "simple_note": [
          "Testing Notes",
          "Notes added 2"
      ],
      "created_at": "2019-11-29T13:57:12.825Z",
      "updated_at": "2019-11-29T13:57:12.825Z",
      "photos": [],
      "products": []
  },
  {
      "id": 3,
      "formula_note": [
          "aaaaaaaaa",
          "sdfdsf"
      ],
      "simple_note": [
          "dsfdsfdsf",
          "sfdsfds"
      ],
      "created_at": "2019-11-25T13:52:11.480Z",
      "updated_at": "2019-11-25T13:52:11.480Z",
      "photos": [],
      "products": []
  },
  {
      "id": 2,
      "formula_note": [
          "aaaaaaaaa",
          "sdfdsf"
      ],
      "simple_note": [
          "dsfdsfdsf",
          "sfdsfds"
      ],
      "created_at": "2019-11-22T06:09:57.552Z",
      "updated_at": "2019-11-22T06:09:57.552Z",
      "photos": [
          {
              "id": 42,
              "created_at": "2019-11-22T06:09:57.587Z",
              "asset_url": "https://hairfolioapp.s3.us-west-1.amazonaws.com/post/39574779_upload_1559716812746_.jpg",
              "post_id": null,
              "labels": [],
              "video_url": null
          }
      ],
      "products": [
          {
              "id": 87,
              "name": "newtest new new Test",
              "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_oyv7b.png",
              "is_favourite": false,
              "is_trending": null,
              "new_arrival": null,
              "price": "5.00",
              "short_description": "fg",
              "description": "fgd",
              "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/oyv7b.png",
              "quantity": 45,
              "favourites_count": null,
              "link_url": null,
              "image_url": null,
              "cloudinary_url": null,
              "created_at": "2019-07-02T12:15:02.162Z",
              "categories": [],
              "final_price": "5.00",
              "discount_percentage": null,
              "tag": null,
              "product_brand": {
                  "id": 1,
                  "title": "Matrix",
                  "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/matrix.png",
                  "name": "Matrix"
              },
              "product_galleries": [
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/c9ads.png",
                      "id": 92
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/vf8bu.png",
                      "id": 93
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/m2fsn.png",
                      "id": 94
                  }
              ],
              "hair_types": [],
              "product_types": [],
              "ingredients": [],
              "preferences": [],
              "styling_tools": [],
              "consistency_types": [],
              "collection": null,
              "shampoo": null,
              "conditioner": null,
              "styling_product": null
          },
          {
              "id": 88,
              "name": "newtest new new Test",
              "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_wj62t.png",
              "is_favourite": false,
              "is_trending": null,
              "new_arrival": null,
              "price": "54.00",
              "short_description": "fhj",
              "description": "juy",
              "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/wj62t.png",
              "quantity": 54,
              "favourites_count": null,
              "link_url": null,
              "image_url": null,
              "cloudinary_url": null,
              "created_at": "2019-07-02T12:40:50.738Z",
              "categories": [],
              "final_price": "54.00",
              "discount_percentage": null,
              "tag": null,
              "product_brand": null,
              "product_galleries": [
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/te1br.png",
                      "id": 99
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/zu1p8.png",
                      "id": 100
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/8qwn9.png",
                      "id": 101
                  }
              ],
              "hair_types": [],
              "product_types": [],
              "ingredients": [],
              "preferences": [],
              "styling_tools": [],
              "consistency_types": [],
              "collection": null,
              "shampoo": null,
              "conditioner": null,
              "styling_product": null
          }
      ]
  },
  {
      "id": 1,
      "formula_note": [
          "aaaaaaaaa",
          "sdfdsf"
      ],
      "simple_note": [
          "dsfdsfdsf",
          "sfdsfds"
      ],
      "created_at": "2019-11-22T05:32:24.995Z",
      "updated_at": "2019-11-22T05:32:24.995Z",
      "photos": [
          {
              "id": 41,
              "created_at": "2019-11-22T05:32:25.005Z",
              "asset_url": "https://hairfolioapp.s3.us-west-1.amazonaws.com/post/39574779_upload_1559716812746_.jpg",
              "post_id": null,
              "labels": [],
              "video_url": null
          }
      ],
      "products": [
          {
              "id": 87,
              "name": "newtest new new Test",
              "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_oyv7b.png",
              "is_favourite": false,
              "is_trending": null,
              "new_arrival": null,
              "price": "5.00",
              "short_description": "fg",
              "description": "fgd",
              "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/oyv7b.png",
              "quantity": 45,
              "favourites_count": null,
              "link_url": null,
              "image_url": null,
              "cloudinary_url": null,
              "created_at": "2019-07-02T12:15:02.162Z",
              "categories": [],
              "final_price": "5.00",
              "discount_percentage": null,
              "tag": null,
              "product_brand": {
                  "id": 1,
                  "title": "Matrix",
                  "image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/matrix.png",
                  "name": "Matrix"
              },
              "product_galleries": [
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/c9ads.png",
                      "id": 92
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/vf8bu.png",
                      "id": 93
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/m2fsn.png",
                      "id": 94
                  }
              ],
              "hair_types": [],
              "product_types": [],
              "ingredients": [],
              "preferences": [],
              "styling_tools": [],
              "consistency_types": [],
              "collection": null,
              "shampoo": null,
              "conditioner": null,
              "styling_product": null
          },
          {
              "id": 88,
              "name": "newtest new new Test",
              "product_thumb": "https://d23qi8xb3q5mph.cloudfront.net/uploads/prod_thumb_image_wj62t.png",
              "is_favourite": false,
              "is_trending": null,
              "new_arrival": null,
              "price": "54.00",
              "short_description": "fhj",
              "description": "juy",
              "product_image": "https://d23qi8xb3q5mph.cloudfront.net/uploads/wj62t.png",
              "quantity": 54,
              "favourites_count": null,
              "link_url": null,
              "image_url": null,
              "cloudinary_url": null,
              "created_at": "2019-07-02T12:40:50.738Z",
              "categories": [],
              "final_price": "54.00",
              "discount_percentage": null,
              "tag": null,
              "product_brand": null,
              "product_galleries": [
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/te1br.png",
                      "id": 99
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/zu1p8.png",
                      "id": 100
                  },
                  {
                      "image_url": "https://d23qi8xb3q5mph.cloudfront.net/uploads/8qwn9.png",
                      "id": 101
                  }
              ],
              "hair_types": [],
              "product_types": [],
              "ingredients": [],
              "preferences": [],
              "styling_tools": [],
              "consistency_types": [],
              "collection": null,
              "shampoo": null,
              "conditioner": null,
              "styling_product": null
          }
      ]
  }
];

@observer
@autobind
export default class Timeline extends PureComponent{  

  constructor(props) {
    super(props);
    this.inputs = {};
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      timelineArray: ds.cloneWithRows(timelines.slice()),
      isShareModalVisible: false,
      isTitleModalVisible: false,
      currentSelectedItem: null,
      shareFrom: '',
      titleName: '',
      noteDescription:''
    };
    
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

  }

  async onNavigatorEvent(event) {
    console.log('Timeline EVENTs IDS=>'+JSON.stringify(event))
    StatusBar.setBarStyle('light-content');
    showLog("CreateLogStore.isNoteCreated ==> " + CreateLogStore.isNoteCreated);
    switch (event.id) {
      
      case 'willAppear':
        //commet this while creating build
        // CreateLogStore.onTimelineload();   
        ContactDetailsStore.isScreenPop = true;
        if(CreateLogStore.isNoteCreated) {
          CreateLogStore.onTimelineload(ContactDetailsStore.contactID);
        }
        else if(this.props.fromScreen == "clientDetails") {
          CreateLogStore.onTimelineload(ContactDetailsStore.contactID);
        }
        break;
      case 'willDisappear':
          if (ContactDetailsStore.isScreenPop) {          
            this.props.navigator.popToRoot({ animated: true });           
          }                
            break;
      default:
        break;
    }
  }

  setModalVisible(stateName, visible,shareObject) {
    if (visible == false) {
      this.setState({ isTitleModalVisible: visible,titleName:'',noteDescription:'' }, () => {
        this.setState({ isShareModalVisible: visible }, () => {
          let textToBeSend = '';
          if (shareObject.url) {
            textToBeSend = '\n'+shareObject.data.title + '\n \n' + shareObject.data.description + '\n \n' + shareObject.url;
          }
          
          showLog('SMS new ==>'+textToBeSend)
          
            if (shareObject != '') {
              if (this.state.shareFrom == 'Email Client') {
                setTimeout(() => {
                  if (shareObject.message) {                    
                    showAlert(shareObject.message);
                  }
                  else {
                    showAlert(shareObject.errors)
                  }
                }, 1200)
              }
              else if (this.state.shareFrom == 'Text Client') {
                setTimeout(() => {
                  Communications.text(this.props.phoneNumber, textToBeSend);
                }, 1200)
              }
              else if (this.state.shareFrom == 'Hyperlink') {
                setTimeout(() => {
                  this.hyperlinkShare(textToBeSend,shareObject.url);
                }, 1200)
              }              
              // showLog('shareObject==>'+this.props.phoneNumber+" "+shareObject)
            }            
             
          // showLog('shareObject==>1 '+this.props.phoneNumber+" "+shareObject)

        });
      });
    }
    if (stateName == "isShareModalVisible") {
      this.setState({ isShareModalVisible: visible, shareFrom: shareObject });
    }
    if (stateName == "isTitleModalVisible") {
      this.setState({ isTitleModalVisible: visible, shareFrom: shareObject });
    }
  }

  
  hyperlinkShare(response,url)  
  {
    showLog("hyperlinkShare==>"+JSON.stringify(response))

    let shareOptions = {
      title: "Hairfolio",
      message:response ,
      // url:BASE_URL+`view_post_meta/${this.state.currentSelectedItem.id}`,
      // url:response.url,
      url:url,
      subject: "Hairfolio" //  for email
    };
    // ShareA.open(shareOptions);
    Share.share(shareOptions)

  }

  renderShareModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ flexDirection: "column", height: windowHeight, position:'absolute', backgroundColor: COLORS.DROPSHADOW, zIndex:999999 }}
        visible={this.state.isShareModalVisible}
        onRequestClose={() => { this.setModalVisible('isShareModalVisible', false,'') }}>

        {this.renderTextModal()}

        <TouchableOpacity
          style={{ zIndex:999999, flex: 1,height: windowHeight, justifyContent: 'flex-end', backgroundColor: COLORS.DROPSHADOW, position:'absolute' }}
          activeOpacity={1}
        // onPressOut={() => { }}
        >
          <View style={{ alignSelf: 'flex-end', borderTopLeftRadius: 10, borderTopRightRadius: 10, height: (windowHeight > 800) ? (windowHeight / 2) : (windowHeight / 1.75), width: windowWidth, backgroundColor: COLORS.WHITE }}>
            <Image source={require('img/share_client.png')} style={{ alignSelf: 'center', width: 40, height: 40, resizeMode: 'contain', position: 'absolute', top: -20 }} />
            <TouchableOpacity
              style={{ padding: 15, alignSelf: 'flex-end' }}
              onPress={() => { this.setModalVisible('isShareModalVisible', false,'') }}
            >
              <Image source={require('img/close.png')} style={{}} />
            </TouchableOpacity>

            {this.ShareRow(
              require('img/emailclient.png'),
              'Email Client',
              () => {
                this.setModalVisible('isTitleModalVisible', true,'Email Client')
              }
            )}

            {this.ShareRow(
              require('img/textclient.png'),
              'Text Client',
              () => {
                this.setModalVisible('isTitleModalVisible', true,'Text Client')
              }
            )}

            {this.ShareRow(
              require('img/hyperlink.png'),
              'Hyperlink',
              () => {
                this.setModalVisible('isTitleModalVisible', true,'Hyperlink')
              })}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  renderTextModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{ flexDirection: "column", height: windowHeight, position:'absolute', zIndex:999999999 }}
        visible={this.state.isTitleModalVisible}
        onRequestClose={() => { this.setModalVisible('isTitleModalVisible', false,'') }}>

        <View style={{  zIndex:999999999, flexDirection: "column", height: windowHeight, width: windowWidth, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.DROPSHADOW, position:'absolute' }}>

          <KeyboardAwareScrollView
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"always"}
            keyboardDismissMode={'none'}
            overScrollMode={"never"}
            >

            <View style={{ flexDirection: "column", height: windowHeight, width: windowWidth, backgroundColor: COLORS.DROPSHADOW, alignItems: "center", justifyContent: "center" }}>

              <View style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, width: windowWidth - 60, backgroundColor: COLORS.WHITE }}>
                <TouchableOpacity
                  style={{ paddingVertical: 5, paddingHorizontal: 5, alignSelf: 'flex-end' }}
                  onPress={() => { 
                    Keyboard.dismiss();
                    this.setModalVisible('isTitleModalVisible', false,'') 
                  }}
                >
                  <Image source={require('img/close.png')} style={{}} />
                </TouchableOpacity>
                <Text style={{ marginTop: -15, marginRight: 70, fontFamily: FONTS.HEAVY, color: COLORS.GREEN, fontSize: 14 }}>Add Title</Text>

                {/* </View> */}
                <TextInput
                  placeholder='Title Name'
                  multiline={false}
                  placeholderTextColor={COLORS.PLACEHOLDER_SEARCH_FIELD}
                  returnKeyType={"next"}
                  onChangeText={text => this.setState({titleName:text})}
                  value={this.state.titleName}
                  ref={input => {
                      this.inputs["title"] = input;
                  }}
                  maxLength={100}
                  onSubmitEditing={() => {
                    this.inputs["description"].focus();
                  }}             
                  style={{
                    height: 30,
                    color: COLORS.DARK,
                    fontSize: h(30),
                    borderBottomColor: COLORS.BORDER_BOTTOM,
                    borderBottomWidth: 1
                  }}
                />

                <View style={{ height: 1, backgroundColor: COLORS.BORDER_BOTTOM }}></View>

                <Text style={{ marginTop: 18, fontFamily: FONTS.HEAVY, color: COLORS.GREEN, fontSize: 14 }}>Add Description</Text>

                <TextInput
                  multiline={true}
                  placeholder='Description'
                  autoCorrect={false}
                  maxLength={500}
                  onChangeText={text => this.setState({noteDescription:text})}
                  value={this.state.noteDescription}
                  placeholderTextColor={COLORS.PLACEHOLDER_SEARCH_FIELD}
                  numberOfLines={7}
                  ref={input => {
                    this.inputs["description"] = input;
                  }}
                  style={{
                    minHeight: windowHeight / 10,
                    maxHeight: windowHeight / 13,
                    color: COLORS.DARK,
                    // maxHeight: windowHeight/3,
                    // padding:h(30),
                    // minHeight: 80,
                    // flex: 1,
                    // paddingHorizontal: 15,
                    fontSize: h(30),
                    // borderBottomColor: COLORS.BORDER_BOTTOM,
                    // borderBottomWidth: 1
                  }}
                />                

                <TouchableOpacity
                  onPress={async() => {
                    showLog('title notes==>'+this.state.titleName+' '+this.state.noteDescription+' '+this.state.currentSelectedItem.id)
                    if (this.state.shareFrom == 'Email Client') {                      
                      let res = await CreateLogStore.emailShareApi(this.state.titleName, this.state.noteDescription, this.state.currentSelectedItem.id)
                      if (res) {                        
                        Keyboard.dismiss();
                        this.setModalVisible('isTitleModalVisible', false, res)                        
                      } else {
                        Keyboard.dismiss();
                        this.setModalVisible('isTitleModalVisible', false, '')
                      }
                    }
                    else if (this.state.shareFrom == 'Text Client') {
                      let res = await CreateLogStore.shareLogApi(this.state.titleName, this.state.noteDescription, this.state.currentSelectedItem.id)
                      if (res) {                        
                        Keyboard.dismiss();
                        this.setModalVisible('isTitleModalVisible', false, res);                        
                      } else {
                        Keyboard.dismiss();
                        this.setModalVisible('isTitleModalVisible', false, '')
                      }
                      showLog('from===>Text Client ' + this.state.shareFrom);
                    }
                    else if (this.state.shareFrom == 'Hyperlink') {
                      let res = await CreateLogStore.shareLogApi(this.state.titleName, this.state.noteDescription, this.state.currentSelectedItem.id)
                      if (res) {                        
                        Keyboard.dismiss();
                        this.setModalVisible('isTitleModalVisible', false, res);                        
                      } else {
                        Keyboard.dismiss();
                        this.setModalVisible('isTitleModalVisible', false, '')
                      }
                      showLog('from===>Hyperlink ' + this.state.shareFrom);
                    }
                    else {
                      Keyboard.dismiss();
                      this.setModalVisible('isTitleModalVisible', false, '')
                      showLog('from===>' + this.state.shareFrom);
                    }
                    
                    showLog('SELECTED ITEM===>'+JSON.stringify(this.state.currentSelectedItem))
                  }}
                  style={{
                    backgroundColor: COLORS.DARK,
                    width: windowWidth - 220,
                    alignSelf: 'center',
                    paddingVertical: 10,
                    marginTop: 30,
                    marginBottom: 15,
                    borderRadius: 3,
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontFamily: FONTS.MEDIUM,
                      fontSize: 14
                    }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>


      </Modal>
    )
  }

  ShareRow = (path, text, onPress) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          width: windowWidth,
          backgroundColor: COLORS.WHITE,
          alignItems: 'center',
          padding: 15,
          marginVertical: 10,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 1
        }}
        onPress={onPress}>
        <Image source={path} />
        <Text style={{ paddingLeft: 10, color: COLORS.MODAL_TITLE, fontFamily: FONTS.MEDIUM }}> {text} </Text>
      </TouchableOpacity>
    )
  }

  onClickShare(item) {
    this.setState({ currentSelectedItem: item });
    this.setModalVisible('isShareModalVisible', true,'');
  }

  async onTimeLineClick(item, index) {
    showLog("ITEM ==> " + JSON.stringify(item));
    await CreateLogStore.reset();
    await CreateLogStore.reset(true);
    CreateLogStore.gallery.wasOpened = false;
    ContactDetailsStore.isScreenPop = false;

    CreateLogStore.noteId = item.id;
    CreateLogStore.cardNotesArray = await CreateLogStore.structureNotesObject(item.formula_note, item.simple_note);

    await item.products.map(async(el) => {
      await CreateLogStore.addLibraryProductsToGallary(el, false);
    })

    CreateLogStore.gallery.addLibraryPicturesFromEdit(item.photos);
    CreateLogStore.gallery.wasOpened = false;
    CreateLogStore.gallery.selectedPicture = _.first(CreateLogStore.gallery.pictures);

    CreateLogStore.isInViewMode = true;
    this.props.navigator.push({
      screen: 'hairfolio.CreateLogScreen',
      navigatorStyle: NavigatorStyles.tab,
      passProps: {
        isFromEdit: true
      }
    });
  } 

  onTimeLineLongPress(note){

    Alert.alert(
      "",
      "Are you sure want to delete this note?",
      [
        { text: "OK", onPress: () => this.deleteNoteApiCall(note.id) },
        { text: "Cancel", },
       
      ],
      { cancelable: false }
    );

    showLog('onTimeLineLongPress==>'+JSON.stringify(note))
    
  }

  async deleteNoteApiCall(deleteNoteId){
    let res = await CreateLogStore.deleteNoteApi(deleteNoteId)
    if (res) {     
      showAlert(res.message);  
      CreateLogStore.onTimelineload(ContactDetailsStore.contactID);         
    } else {
      showLog('note delete error=>'+JSON.stringify(res))
    }
  }

  render() {  
    showLog('device height==>'+windowHeight)
    return (
      <View style={styles.wrapper}>
        {this.renderShareModal()}
        <BlackHeader
          onLeft={async() => {
            ContactDetailsStore.isScreenPop = false;
            await CreateLogStore.reset();
            await CreateLogStore.reset(true);
            CreateLogStore.gallery.wasOpened = false;
            this.props.navigator.pop({ animated: true })
          }}
          renderTitleStyle={{fontSize: h(38)}}
          title="Timeline" />
        <View style={{
          // flex:1,
          backgroundColor: COLORS.WHITE,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          // backgroundColor:'green'
        }}>
            <View style={{
            // flex: 1,
            // (height > 800) ? h(88) + 40 : h(88) + 20
            width: windowWidth,
            // height:windowHeight,
            height:(windowHeight>800)?(windowHeight-(h(88) + 100)) : (windowHeight-(h(88) + 40)),
            // paddingVertical: 10,
            // paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center', 
            // paddingBottom:150
              // backgroundColor:'red'
          }}>   
            {(CreateLogStore.timelineArray.length > 0) ?
              <ListView
                style={{ flex: 1}}
                contentContainerStyle={styles.listContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
                // dataSource={(this.state.timelineArray)}
                dataSource={(CreateLogStore.dataSourceForFilterTimeline)}
                renderRow={(item, index) => {
                  return (
                    <TimelineRow
                      item={item}
                      index={index}
                      onPress={() => {
                        this.onTimeLineClick(item, index);
                      }}
                      onPressShare={() => {
                        this.onClickShare(item)
                      }}
                      onLongPress={()=>{
                        this.onTimeLineLongPress(item)
                      }}
                    />
                  );
                }}
                // renderEmptyListComponent={() => <Text>No Result</Text>}
                onEndReached={() => {
                  CreateLogStore.loadTimelineNextPage();
                }}                
              />
              :
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingTop: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                  }}
                >
                  No Results
                </Text>
              </View>
            }
              
          </View>
        </View>
        {(CreateLogStore.isLoadingTimelineNextPage) 
        ? 
          <View style={{ width: windowWidth, height: windowHeight, position:'absolute', justifyContent: 'center', backgroundColor:COLORS.DROPSHADOW }}>
            <ActivityIndicator size='large' />
          </View>
        :
          null
        } 
      </View>
    )
  }
 
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:COLORS.DARK,
  },
  mainContainer: {
    // flex:1,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius:20,
    paddingVertical: 10,
    paddingHorizontal:16
  },
  listContainer: {
    padding: 10,
    // backgroundColor: COLORS.PINK,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});