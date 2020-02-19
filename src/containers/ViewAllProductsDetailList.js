import { observer } from "mobx-react";
import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import { ActivityIndicator, windowHeight, windowWidth } from "../helpers";
import CategoryStore from '../mobx/stores/hfStore/CategoryStore';
import WishListStore from '../mobx/stores/hfStore/WishListStore';
import { COLORS, FONTS, h } from "../style";
import CartCounterView from "../components/CartCounterView";
import CartStore from '../mobx/stores/hfStore/CartStore';
import ProductStore from '../mobx/stores/hfStore/ProductStore';


@observer
export default class ViewAllProductsDetailList extends Component {

  constructor(props) {
    super(props);
    this.state= {
      productArr : [
        {
          "id": 282,
          "name": "YS PARK G-Series Curl Shine Styler Round Brush - 55G2 ",
          "is_favourite": true,
          "price": "100.0",
          "quantity": 1000,
          "favourites_count": 1,
          "link_url": "https://www.ysparkusa.com/ys-park-g-series-curl-shine-styler-round-brush-55g2-w-2-2-x-l-8-7-br55g2",
          "image_url": "https://www.ysparkusa.com/media/catalog/product/cache/4/small_image/254x254/9df78eab33525d08d6e5fb8d27136e95/y/s/ys_park_brush_g_55g2.jpg",
          "cloudinary_url": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg",
          "created_at": "2017-03-13T21:34:15.306Z",
          "isShow": false,
          "flexValue": 'none',
          "categories": [
            {
              "id": 9,
              "name": "Hair Dryer",
              "position": 0,
              "created_at": "2018-11-21T12:09:56.882Z",
              "updated_at": "2018-11-22T06:21:58.964Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 4,
              "name": "Hair Repair kit",
              "position": 0,
              "created_at": "2018-11-21T12:08:31.093Z",
              "updated_at": "2018-11-22T06:22:46.578Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 3,
              "name": "Massy Look",
              "position": 0,
              "created_at": "2016-12-17T13:03:27.392Z",
              "updated_at": "2018-11-22T06:22:59.302Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 1,
              "name": "Men’s Hair cut",
              "position": 0,
              "created_at": "2016-12-17T13:03:15.628Z",
              "updated_at": "2018-11-22T06:23:15.081Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 6,
              "name": "Brown hair",
              "position": 0,
              "created_at": "2018-11-21T12:09:01.086Z",
              "updated_at": "2018-12-03T10:13:22.810Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            }
          ],
          "tag": {
            "id": 738,
            "created_at": "2017-03-13T21:34:11.977Z",
            "name": "ysparkgseriescurlshinestylerroundbrush55g2",
            "last_photo": null
          }
        },
        {
          "id": 281,
          "name": "YS PARK Hair Brush - Beetle - Luster Air Cushion - Marble Wood Air Vent - Boar & Nylon YS-BR50AS2",
          "is_favourite": false,
          "price": null,
          "quantity": null,
          "favourites_count": 0,
          "link_url": "https://www.ysparkusa.com/ys-park-hair-brush-beetle-luster-air-cushion-marble-wood-air-vent-boar-nylon-br50as2",
          "image_url": "https://www.ysparkusa.com/media/catalog/product/cache/4/small_image/254x254/9df78eab33525d08d6e5fb8d27136e95/y/s/ys_park_brs_sf_mrb_arv_bor_ny.jpg",
          "cloudinary_url": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440706/e0akepyji4zwll8icy9h.jpg",
          "created_at": "2017-03-13T21:31:45.495Z",
          "isShow": false,
          "flexValue": 'none',
          "categories": [
            {
              "id": 9,
              "name": "Hair Dryer",
              "position": 0,
              "created_at": "2018-11-21T12:09:56.882Z",
              "updated_at": "2018-11-22T06:21:58.964Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 7,
              "name": "Straight",
              "position": 0,
              "created_at": "2018-11-21T12:09:29.141Z",
              "updated_at": "2018-11-22T06:22:19.487Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 4,
              "name": "Hair Repair kit",
              "position": 0,
              "created_at": "2018-11-21T12:08:31.093Z",
              "updated_at": "2018-11-22T06:22:46.578Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 3,
              "name": "Massy Look",
              "position": 0,
              "created_at": "2016-12-17T13:03:27.392Z",
              "updated_at": "2018-11-22T06:22:59.302Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 11,
              "name": "Lowlights",
              "position": 0,
              "created_at": "2018-11-22T06:23:58.585Z",
              "updated_at": "2018-12-03T10:17:11.356Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/kzzplleejc3jtco6uncl.jpg"
            }
          ],
          "tag": {
            "id": 736,
            "created_at": "2017-03-13T21:31:28.175Z",
            "name": "ysparkhairbrushbeetle",
            "last_photo": null
          }
        },
        {
          "id": 280,
          "name": "YS PARK Hair Brush - 558 (Nylon/Boar) Black",
          "is_favourite": true,
          "price": null,
          "quantity": null,
          "favourites_count": 1,
          "link_url": "https://www.ysparkusa.com/ys-park-hair-brush-558-nylon-boar-black-br558",
          "image_url": "https://www.ysparkusa.com/media/catalog/product/cache/4/small_image/254x254/9df78eab33525d08d6e5fb8d27136e95/y/s/ys_park_brs_558_ny_bor_blk.jpg",
          "cloudinary_url": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/kzzplleejc3jtco6uncl.jpg",
          "created_at": "2017-03-13T21:31:45.208Z",
          "isShow": false,
          "flexValue": 'none',
          "categories": [
            {
              "id": 9,
              "name": "Hair Dryer",
              "position": 0,
              "created_at": "2018-11-21T12:09:56.882Z",
              "updated_at": "2018-11-22T06:21:58.964Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 7,
              "name": "Straight",
              "position": 0,
              "created_at": "2018-11-21T12:09:29.141Z",
              "updated_at": "2018-11-22T06:22:19.487Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 4,
              "name": "Hair Repair kit",
              "position": 0,
              "created_at": "2018-11-21T12:08:31.093Z",
              "updated_at": "2018-11-22T06:22:46.578Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 3,
              "name": "Massy Look",
              "position": 0,
              "created_at": "2016-12-17T13:03:27.392Z",
              "updated_at": "2018-11-22T06:22:59.302Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 6,
              "name": "Brown hair",
              "position": 0,
              "created_at": "2018-11-21T12:09:01.086Z",
              "updated_at": "2018-12-03T10:13:22.810Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 11,
              "name": "Lowlights",
              "position": 0,
              "created_at": "2018-11-22T06:23:58.585Z",
              "updated_at": "2018-12-03T10:17:11.356Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/kzzplleejc3jtco6uncl.jpg"
            }
          ],
          "tag": {
            "id": 735,
            "created_at": "2017-03-13T21:31:28.151Z",
            "name": "ysparkhairbrush558black",
            "last_photo": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1500324080/ovvamn0enl1z5fjqs0nt.jpg"
          }
        },
        {
          "id": 279,
          "name": "YS PARK Hair Brush - 451 - 7 Row",
          "is_favourite": true,
          "price": null,
          "quantity": null,
          "favourites_count": 2,
          "link_url": "https://www.ysparkusa.com/ys-park-hair-brush-451-7-row-br451",
          "image_url": "https://www.ysparkusa.com/media/catalog/product/cache/4/small_image/254x254/9df78eab33525d08d6e5fb8d27136e95/y/s/ys_park_brs_451_7_row.jpg",
          "cloudinary_url": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/ivjypesle3a62hzgzuys.jpg",
          "created_at": "2017-03-13T21:31:44.462Z",
          "isShow": false,
          "flexValue": 'none',
          "categories": [
            {
              "id": 10,
              "name": "Hair Care",
              "position": 0,
              "created_at": "2018-11-21T12:10:25.561Z",
              "updated_at": "2018-11-22T06:21:45.801Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/kzzplleejc3jtco6uncl.jpg"
            },
            {
              "id": 9,
              "name": "Hair Dryer",
              "position": 0,
              "created_at": "2018-11-21T12:09:56.882Z",
              "updated_at": "2018-11-22T06:21:58.964Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 7,
              "name": "Straight",
              "position": 0,
              "created_at": "2018-11-21T12:09:29.141Z",
              "updated_at": "2018-11-22T06:22:19.487Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 5,
              "name": "Conditioner",
              "position": 0,
              "created_at": "2018-11-21T12:08:46.771Z",
              "updated_at": "2018-11-22T06:22:38.443Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 4,
              "name": "Hair Repair kit",
              "position": 0,
              "created_at": "2018-11-21T12:08:31.093Z",
              "updated_at": "2018-11-22T06:22:46.578Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 3,
              "name": "Massy Look",
              "position": 0,
              "created_at": "2016-12-17T13:03:27.392Z",
              "updated_at": "2018-11-22T06:22:59.302Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 1,
              "name": "Men’s Hair cut",
              "position": 0,
              "created_at": "2016-12-17T13:03:15.628Z",
              "updated_at": "2018-11-22T06:23:15.081Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 6,
              "name": "Brown hair",
              "position": 0,
              "created_at": "2018-11-21T12:09:01.086Z",
              "updated_at": "2018-12-03T10:13:22.810Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 12,
              "name": "Curly",
              "position": 0,
              "created_at": "2018-11-22T06:25:04.310Z",
              "updated_at": "2018-12-03T10:15:22.139Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/kzzplleejc3jtco6uncl.jpg"
            },
            {
              "id": 11,
              "name": "Lowlights",
              "position": 0,
              "created_at": "2018-11-22T06:23:58.585Z",
              "updated_at": "2018-12-03T10:17:11.356Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440705/kzzplleejc3jtco6uncl.jpg"
            }
          ],
          "tag": {
            "id": 734,
            "created_at": "2017-03-13T21:31:28.142Z",
            "name": "ysparkhairbrush4517row",
            "last_photo": null
          }
        },
        {
          "id": 278,
          "name": "YS PARK G-Series Curl Shine Styler Round Brush - 66GW",
          "is_favourite": false,
          "price": null,
          "quantity": null,
          "favourites_count": 0,
          "link_url": "https://www.ysparkusa.com/ys-park-g-series-curl-shine-styler-round-brush-66gw-1-w-2-8-x-l-9-0-br66gwo",
          "image_url": "https://www.ysparkusa.com/media/catalog/product/cache/4/small_image/254x254/9df78eab33525d08d6e5fb8d27136e95/y/s/ys_park_brush_g_66gwo.jpg",
          "cloudinary_url": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440704/h9h8r6aldqxkgagcs9fd.jpg",
          "created_at": "2017-03-13T21:31:44.164Z",
          "isShow": false,
          "flexValue": 'none',
          "categories": [
            {
              "id": 9,
              "name": "Hair Dryer",
              "position": 0,
              "created_at": "2018-11-21T12:09:56.882Z",
              "updated_at": "2018-11-22T06:21:58.964Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 7,
              "name": "Straight",
              "position": 0,
              "created_at": "2018-11-21T12:09:29.141Z",
              "updated_at": "2018-11-22T06:22:19.487Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 4,
              "name": "Hair Repair kit",
              "position": 0,
              "created_at": "2018-11-21T12:08:31.093Z",
              "updated_at": "2018-11-22T06:22:46.578Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 3,
              "name": "Massy Look",
              "position": 0,
              "created_at": "2016-12-17T13:03:27.392Z",
              "updated_at": "2018-11-22T06:22:59.302Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            },
            {
              "id": 2,
              "name": "Top hair stylist",
              "position": 0,
              "created_at": "2016-12-17T13:03:22.431Z",
              "updated_at": "2018-11-22T06:23:07.618Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440706/e0akepyji4zwll8icy9h.jpg"
            },
            {
              "id": 1,
              "name": "Men’s Hair cut",
              "position": 0,
              "created_at": "2016-12-17T13:03:15.628Z",
              "updated_at": "2018-11-22T06:23:15.081Z",
              "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
            }
          ],
          "tag": {
            "id": 733,
            "created_at": "2017-03-13T21:31:28.118Z",
            "name": "ysparkgseriescurlshinestylerroundbrush66gw",
            "last_photo": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1529087049/caqtrxxfqhjjeoqznywc.jpg"
          }
        }], //props.productsList,
      isDialogVisible:false,
      currentItem: {
        "id": 282,
        "name": "YS PARK G-Series Curl Shine Styler Round Brush - 55G2 ",
        "is_favourite": true,
        "price": "100.0",
        "quantity": 1000,
        "favourites_count": 1,
        "link_url": "https://www.ysparkusa.com/ys-park-g-series-curl-shine-styler-round-brush-55g2-w-2-2-x-l-8-7-br55g2",
        "image_url": "https://www.ysparkusa.com/media/catalog/product/cache/4/small_image/254x254/9df78eab33525d08d6e5fb8d27136e95/y/s/ys_park_brush_g_55g2.jpg",
        "cloudinary_url": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg",
        "created_at": "2017-03-13T21:34:15.306Z",
        "categories": [
          {
            "id": 9,
            "name": "Hair Dryer",
            "position": 0,
            "created_at": "2018-11-21T12:09:56.882Z",
            "updated_at": "2018-11-22T06:21:58.964Z",
            "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
          },
          {
            "id": 4,
            "name": "Hair Repair kit",
            "position": 0,
            "created_at": "2018-11-21T12:08:31.093Z",
            "updated_at": "2018-11-22T06:22:46.578Z",
            "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
          },
          {
            "id": 3,
            "name": "Massy Look",
            "position": 0,
            "created_at": "2016-12-17T13:03:27.392Z",
            "updated_at": "2018-11-22T06:22:59.302Z",
            "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
          },
          {
            "id": 1,
            "name": "Men’s Hair cut",
            "position": 0,
            "created_at": "2016-12-17T13:03:15.628Z",
            "updated_at": "2018-11-22T06:23:15.081Z",
            "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
          },
          {
            "id": 6,
            "name": "Brown hair",
            "position": 0,
            "created_at": "2018-11-21T12:09:01.086Z",
            "updated_at": "2018-12-03T10:13:22.810Z",
            "image": "http://res.cloudinary.com/www-hairfolioapp-com/image/upload/v1489440855/bmxi1ynihz9wlsqetsuo.jpg"
          }
        ],
        "tag": {
          "id": 738,
          "created_at": "2017-03-13T21:34:11.977Z",
          "name": "ysparkgseriescurlshinestylerroundbrush55g2",
          "last_photo": null
        }
      },
      displayValue:'none',
      buttonText:'Show'
    }
  }

  render() {
    let wishListStore = WishListStore;
    let store = CategoryStore;
    if (wishListStore.isLoading || store.isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View style = {styles.container}>
        <BlackHeader onLeft = {
          () => this.props.navigator.pop({
            animated: true
          })
        }
        title = {(this.props.categoryTitle) ? this.props.categoryTitle : ''}
        onRenderRight = {
          () => (
          <TouchableOpacity onPress = {
              () => {
                this.props.navigator.push({
                    screen: 'hairfolio.CartList',
                    navigatorStyle: NavigatorStyles.tab,
                  });
              }
            }>
            <Image style = {styles.cartIcon}
            source = { require("img/cart_icon.png") }
            />
            <CartCounterView cartIconView={{marginRight:5,marginTop:-32}} numberOfBagItems = {CartStore.numberOfBagItems} />
            </TouchableOpacity>
          )
        }
        />
    
        <ScrollView bounces={false} style={{padding:10}}>
          {this.state.productArr.map((data, index) => {
            return (
              <View style={{flex:1, paddingBottom: 10, width:windowWidth}}>
                {
                  (index == 0) && 
                  <Image
                    style={styles.backgroundStyle}
                    source={require('img/banner1.jpg')}/>
                }
                  
                { (index == 1) && 
                  <Image
                    style={styles.backgroundStyle}
                    source={require('img/banner2.jpg')}/>
                }

                { (index == 2) && 
                  <Image
                    style={styles.backgroundStyle}
                    source={require('img/banner3.jpg')}/>
                }

                { (index == 3) && 
                  <Image
                    style={styles.backgroundStyle}
                    source={require('img/banner1.jpg')}/>
                }

                { (index == 4) && 
                  <Image
                    style={styles.backgroundStyle}
                    source={require('img/banner2.jpg')}/>
                }

                <View style={{flexDirection:'row', width: windowWidth-20, alignItems:'center', paddingTop:10, paddingBottom:5}}>
                  <Text style = {[styles.categoryName, {flex:1}]} numberOfLines={1}>
                    {(data.name) ? data.name : ''}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderColor:COLORS.DARK,
                      borderRadius:5,
                      borderWidth:0.5,
                      paddingLeft:10,
                      paddingRight:10,
                      paddingTop:3,
                      paddingBottom:3,
                      marginLeft:5,
                      width:60,
                      justifyContent:'center',
                      alignItems:'center'
                    }}
                    onPress={() => {
                    var temp = data;
                    temp.isShow = !data.isShow;
                    temp.flexValue = (temp.flexValue == "none") ? "flex" : "none";
                    var arr = this.state.productArr;
                    arr[index] = temp;
                    this.setState({
                      productArr: arr,
                    })
                    }
                    }
                  >
                    <Text style={[styles.categoryName,{color: COLORS.DARK,fontFamily:FONTS.MEDIUM,
                          fontSize:h(25)}]}> {(data.isShow) ? "X" : "Show"} </Text>
                  </TouchableOpacity>
                </View>
        
                <ScrollView
                      bounces={false}
                      style={{width: windowWidth - 15, marginLeft: -5, paddingTop:5, paddingRight:5, paddingLeft:2, paddingBottom: 20, display: (data.isShow) ? 'flex' : 'none'}}
                      // style={{backgroundColor:'pink', width: windowWidth - 10, marginLeft:-10 ,padding:10,paddingBottom: 20, display: (data.isShow) ? 'flex' : 'none'}}
                      horizontal={true}>
                      {this.state.productArr.map((data1, index1) => {
                        return (
                          <View style={styles.productListingWrapper}>
                            <TouchableOpacity style={styles.productTouchable}
                              onPress={() => {
                                
                                this.props.navigator.push({
                                  screen: 'hairfolio.ProductDetail',
                                  navigatorStyle: NavigatorStyles.tab,
                                  passProps: {
                                    prod_id: data1.id,
                                    categoryTitle: this.props.categoryTitle,
                                    isFrom:"viewAllProductDetailList"
                                  }
                                });
                              }}>
                              <Image
                                source={(data1.cloudinary_url) ? {uri: data1.cloudinary_url} : require('img/medium_placeholder_icon.png')}            
                                style={styles.productImage} />
                            </TouchableOpacity>
                            <Text style = {styles.productName} numberOfLines={1}>
                              {data1.name}
                            </Text>
                          </View>
                        )
                      })}
                    </ScrollView>
              </View>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.WHITE,
    height: windowWidth , 
  },
  cartIcon:{
    // width: h(35),
    // height: h(35),
    width: h(38),
    height: h(38),
    alignSelf: "flex-end",
    marginRight: 15
  },
  backgroundStyle: { 
    // width: windowWidth-20,
    height:windowWidth,
    resizeMode:'contain',
    marginLeft:-200
  },
  // scrollStyle: {
  //   width: windowWidth - 20,
  //   paddingTop:5,
  //   paddingRight:5,
  //   paddingLeft:2,
  //   paddingRight:5,
  //   marginRight:2
  // },
  productListingWrapper: { 
    width: h(220),
    height: h(300),
    marginRight:5,
    marginLeft:5
  },
  productTouchable: {  
    height: h(300), width: h(220) ,           
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    },
    backgroundColor:COLORS.WHITE
  },
  productImage: {
    height: h(300),
    width: h(220), 
    borderRadius: 5,
    resizeMode:'contain'
  },
  productName: {
    fontFamily: FONTS.LIGHT,
    fontSize: h(24),
    textAlign: "center",
    color:COLORS.DARK,
    backgroundColor:COLORS.TRANSPARENT,
    paddingTop:5,
    paddingLeft:5,
    paddingRight:5,
  },
  categoryName: {
    color:COLORS.BLACK,
    fontFamily: FONTS.MEDIUM, 
    fontSize: h(30),
    paddingTop:5
  },
  subCategoryName: {
    color: COLORS.DARK, 
    fontFamily: FONTS.LIGHT, 
    fontSize: h(24),
    paddingBottom:5
  },
  modalView:{
    width:windowWidth-30,
    height:windowHeight/3,
    backgroundColor:COLORS.BACKGROUND_SEARCH_FIELD,
    position:'absolute',
    bottom:25,
    alignSelf:'center',
    padding:15,
    flexDirection:'row'
  },
  modalImageView:{
    width:windowWidth/2,
    backgroundColor: COLORS.WHITE,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5
  },
  modalImageStyle:{
    height:(windowHeight/3)-30,
    width:windowWidth/2,
    borderRadius:5,
    resizeMode:'contain'
  },
  modalTextView:{
    flex:1,
    marginLeft:20,
  },
  modalName:{
    color:COLORS.BLACK,
    fontFamily:FONTS.ROMAN,
    fontSize: h(30),
    marginTop:10
  },
  modalSubName:{
    color:COLORS.DARK,
    fontFamily:FONTS.LIGHT,
    fontSize: h(25),
  },
  modalPrice:{
    color:COLORS.DARK,
    fontFamily:FONTS.ROMAN,
    fontSize: h(27),
    marginBottom:10
  },
  modalBtn:{
    backgroundColor:COLORS.DARK2,
    width:'100%',
    height:30,
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    flexDirection:'row'
  },
  modalBtnText:{
    color:COLORS.WHITE,
    fontSize:h(30),
    fontFamily:FONTS.ROMAN,
    textAlign:'center',
  },
  modalShareView:{
    position:'absolute',
    top:7,
    right:7,
    height:15,
    width:15,
  },
  modalShareIcon:{
    height:15,
    width:15,
    resizeMode:'contain'
  },
  starTouchable: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding:5
  },
  modalCloseView:{
    position:'absolute',
    top:7,
    right:7,
    height:20,
    width:20,
  },
  modalCloseIcon:{
    height:20,
    width:20,
    resizeMode:'contain'
  }
});