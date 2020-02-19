import { FONTS, Image, ScrollView, Text, TouchableOpacity, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { observer } from "mobx-react";
import React, { Component } from "react";
import NavigatorStyles from '../common/NavigatorStyles';
import { BASE_URL } from '../constants';
import { COLORS, showLog, showAlert, ActivityIndicator } from '../helpers';
import RelatedProductStore from '../mobx/stores/hfStore/RelatedProductStore';
import NewArrivalStore from '../mobx/stores/hfStore/NewArrivalStore';
import CartStore from '../mobx/stores/hfStore/CartStore';
import ProductStore from '../mobx/stores/hfStore/ProductStore';
import WishListStore from '../mobx/stores/hfStore/WishListStore';
import { SCALE } from '../style';

@observer
export default class RelatedProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    let store = RelatedProductStore;
    this.setState({ list: store.dataSource._dataBlob.s1 });
    if (this.props.categoriesData) {
      this.setState({ list: this.props.categoriesData });
    }
  }

  async onStarClick(data, index) {

    showLog("RELATED PRODUCT COMPONENT ==> " + JSON.stringify(data))
    // showLog("RELATED PRODUCT COMPONENT ==> "+JSON.stringify(data))

    let wishListStore = WishListStore;

    if (data.is_favourite) {
      await wishListStore.removeProductFromWishList(data.id).then((result) => {
        if (result.status == "201") {

          wishListStore.isLoading = true

          let temp = RelatedProductStore.relatedProducts
          temp[index].is_favourite = false
          RelatedProductStore.relatedProducts = temp

          setTimeout(() => {
            wishListStore.isLoading = false
          }, 250)

        }
        else {
          showAlert('Something went wrong!')
        }
        // showLog("PRODUCT ARR Remove==> " + JSON.stringify(this.state.productArr))
      });
    } else {
      await wishListStore.addProductToWishList(data.id).then((result) => {
        if (result.status == "201") {
          this.reloadProducts(index);
        }
      });
    }
  }

  async reloadProducts(index) {

    WishListStore.isLoading = true
    let temp = RelatedProductStore.relatedProducts
    showLog("RELATED PRODUCT COMPONENT TEMP ==> " + JSON.stringify(temp))
    temp[index].is_favourite = true
    RelatedProductStore.relatedProducts = temp

    setTimeout(() => {
      WishListStore.isLoading = false
    }, 250)

  }

  async reloadProducts2() {
    let store = CategoryStore;
    await store.load().then((success) => {
      ;
      if (store.categories.length != 0) {
        setTimeout(() => {
          showLog("CAT 11 ==>" + JSON.stringify(store.getProductsByCategory(this.props.categoryId)));
          this.setState({
            productArr: store.getProductsByCategory(this.props.categoryId)[0]
          })
        }, 500);
      }
    });
  }


  render() {
    let store = RelatedProductStore;
    let placeholder_icon = require('img/medium_placeholder_icon.png');
    if (WishListStore.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={{
          flex: 1, padding: 10,
          backgroundColor: COLORS.WHITE,
          flexDirection: 'row',
          flexWrap: 'wrap', justifyContent: 'space-between'
        }}>
          {store.relatedProducts.map((item, index) => {
            return <View
              style={{
                margin: 5,
                marginTop: 10,
                marginBottom: 20,
                width: (windowWidth / 2) - 20,
                height: (windowHeight / 2) - 80,
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  width: (windowWidth / 2) - 20,
                  height: (windowHeight / 2) - 150,
                  alignItems: 'center',
                  elevation: 1,
                  shadowOpacity: 0.10,
                  // shadowRadius: 0.8,
                  shadowOffset: {
                    height: 1.2,
                    width: 1.2
                  }
                }} onPress={ async () => {


                  let res = await ProductStore.getProdDetail(item.id);

                  if (res) {
                    if (res.error) {
                      showLog("CAT PROD LIST ==> " + res.error)
                      showAlert(res.error)
                    }
                    else {

                      this.props.navigator.push({
                        screen: 'hairfolio.ProductDetail',
                        navigatorStyle: NavigatorStyles.tab,
                        passProps: {
                          prod_id: item.id,
                          categoryTitle: item.name,
                          isFrom: "relatedProduct"
                        }
                      });

                    }
                  }
                }}>
                <Image
                  // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
                  defaultSource={placeholder_icon}
                  source={(item.product_image) ? { uri: item.product_image } : placeholder_icon}
                  style={{
                    flex: 1,
                    width: (windowWidth / 2) - 30,
                    height: (windowHeight / 2) - 150,
                    resizeMode: 'contain',

                  }} />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 7,
                    right: 7,
                  }}
                  onPress={() => { this.onStarClick(item, index) }} >
                  <Image
                    style={{
                      position: 'absolute',
                      top: 7,
                      right: 7,
                    }}
                    source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')} />
                </TouchableOpacity>
              </TouchableOpacity>
              <Text
                style={{
                  marginTop: 7,
                  color: COLORS.BLACK,
                  fontFamily: FONTS.LIGHT,
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontSize: SCALE.h(25)
                }} numberOfLines={2}>{item.name}</Text>

              <View style={{
                marginTop: 5,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <TouchableOpacity
                  onPress={() => {
                    showLog("ProductDetail ==>" + JSON.stringify(item))
                    let prod_id = item.id;
                    showLog(" RELATED PRODUCT COMPONENT ==> " + JSON.stringify(item))
                    // CartStore.addToCart(prod_id,item.quantity);
                    CartStore.addToCart(prod_id, 1);
                  }}
                  style={{
                    backgroundColor: COLORS.DARK,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 3,
                    paddingBottom: 3,
                    marginLeft: 5
                  }}>
                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontFamily: FONTS.MEDIUM,
                      fontSize: SCALE.h(25)
                    }}>Add</Text>
                </TouchableOpacity>

                {(item.discount_percentage != null) ?

                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={{
                          color: COLORS.GRAY2,
                          fontFamily: FONTS.ROMAN,
                          fontSize: SCALE.h(27),
                          textDecorationLine: 'line-through'
                        }}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>

                      <Text
                        style={{
                          color: COLORS.DISCOUNT_RED,
                          fontFamily: FONTS.ROMAN,
                          fontSize: SCALE.h(27),
                          marginLeft: 10
                        }}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
                    </View>
                    <Text style={{
                      color: COLORS.DISCOUNT_RED,
                      fontFamily: FONTS.MEDIUM,
                      fontSize: SCALE.h(27)
                    }}>{item.discount_percentage}% off</Text>
                  </View>

                  :
                  <Text style={{
                    color: COLORS.BLACK,
                    fontFamily: FONTS.ROMAN,
                    fontSize: SCALE.h(27),
                  }}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
                }
              </View>
            </View>
          })
          }
        </View>
      </ScrollView>
    )
  }
}