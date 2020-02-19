import { observer } from "mobx-react";
import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import { BASE_URL } from "../constants";
import { ActivityIndicator, Modal, showAlert, showLog, windowHeight, windowWidth } from "../helpers";
import CategoryStore from '../mobx/stores/hfStore/CategoryStore';
import NewArrivalStore from '../mobx/stores/hfStore/NewArrivalStore';
import WishListStore from '../mobx/stores/hfStore/WishListStore';
import { COLORS, FONTS, h } from "../style";
import CartCounterView from "../components/CartCounterView";
import CartStore from '../mobx/stores/hfStore/CartStore';
import ProductStore from '../mobx/stores/hfStore/ProductStore';

@observer
export default class CategoryProductsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productArr: props.productsList,
      isDialogVisible: false,
      currentIndex: props.selectedProductIndex,
      currentItem: (props.selectedProductIndex) ? props.productsList[props.selectedProductIndex] : props.productsList[0],
    }
  }

  componentWillUnmount() {
    // ProductStore.popProduct()
  }

  async onStarClick(data, index) {
    showLog("CATEGORY PRODUCT LIST ==> " + JSON.stringify(data))
    // showAlert("CATEGORY PRODUCT LIST ==> "+JSON.stringify(data))
    let wishListStore = WishListStore;
    if (data.is_favourite) {
      wishListStore.removeProductFromWishList(data.id).then((result) => {
        if (result) {

          
          if (result.status == "201") {
            this.setState({ isDialogVisible: false });
           
            let temp = this.state.productArr
            showLog("REMOVE PRODUCT FROM FAVOURITES ==> " + JSON.stringify(temp[index]))
            temp[index] = result.favourite.product
            this.setState({ productArr: temp })
          }
          else {
            // showAlert('Something went wrong!')
          }

        }
        showLog("PRODUCT ARR Remove==> " + JSON.stringify(this.state.productArr))
      }, (error) => {
        showAlert('Something went wrong!')
      });
    } else {
      wishListStore.addProductToWishList(data.id).then((result) => {
        if (result) {

         
          if (result.status == "201") {
            this.setState({ isDialogVisible: false });
            this.reloadProducts(index);
          }
          else {
            // showAlert('Something went wrong!')
          }

        }
      }, (error) => {
        showAlert('Something went wrong!')
        showLog("wishListStore error ==>" + JSON.stringify(error))
      });
    }
  }

  async reloadProducts(index) {

    let temp = this.state.productArr
    temp[index].is_favourite = true
    this.setState({ productArr: temp })

    showLog("NEW PRODUCT ARR ==> " + JSON.stringify(this.state.productArr))

  }

  render() {
    const placeholder_icon = require('img/medium_placeholder_icon.png');
    let wishListStore = WishListStore;
    let store = CategoryStore;
    if (wishListStore.isLoading || store.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <BlackHeader onLeft={
          () => this.props.navigator.pop({
            animated: true
          })
        }
          title={(this.state.currentItem.name) ? this.state.currentItem.name : ''}
          onRenderRight={
            () => (
              <TouchableOpacity
                style={{ marginRight: 5 }}
                onPress={
                  () => {
                    this.props.navigator.push({
                      screen: 'hairfolio.CartList',
                      navigatorStyle: NavigatorStyles.tab,
                    });
                  }
                }>
                <Image style={styles.cartIcon}
                  source={require("img/cart_icon.png")}
                />
                <CartCounterView cartIconView={{ marginRight: 5, marginTop: -32 }} numberOfBagItems={CartStore.numberOfBagItems} />
              </TouchableOpacity>
            )
          }
        />

        <Modal
          animationType="slide"
          transparent={true}          
          visible={this.state.isDialogVisible}
          onRequestClose={() => {
            this.setState({ isDialogVisible: false });
          }}
        >
        <TouchableOpacity activeOpacity={1} onPress={()=>{ this.setState({ isDialogVisible: false }); }} style={{ height:windowHeight, width:windowWidth, position:'absolute', zIndex:-999999999999}}></TouchableOpacity>

        <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalCloseView} onPress={() => { this.setState({ isDialogVisible: false }) }}>
              <Text style={{ color: COLORS.WHITE, marginTop: 2, alignSelf: "center" }}>x</Text>
            </TouchableOpacity>
            <View style={styles.modalImageView}>
              <Image
                defaultSource={placeholder_icon}
                style={styles.modalImageStyle}
                onError={() => {
                  this.state.currentItem.product_thumb = this.state.currentItem.product_image
                }}
                source={(this.state.currentItem.product_thumb) ? { uri: this.state.currentItem.product_thumb } : placeholder_icon} />
            </View>
            <View style={styles.modalTextView}>

              {/* <TouchableOpacity> */}
              <Text style={styles.modalName} numberOfLines={1}>{this.state.currentItem.name}</Text>
              {/* </TouchableOpacity> */}

              {(this.state.currentItem.discount_percentage != null) ?

                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.modalPrice}>{(this.state.currentItem.final_price) ? ("$" + this.state.currentItem.price) : "$0.0"}</Text>
                    <Text style={[styles.modalFinalPrice, { marginLeft: 10 }]}>{(this.state.currentItem.final_price) ? ("$" + this.state.currentItem.final_price) : "$0.0"}</Text>
                  </View>
                  <Text style={[styles.modalFinalPrice, { marginBottom: 10 }]}>{this.state.currentItem.discount_percentage}% off</Text>
                </View>
                :
                <Text style={[styles.modalFinalPrice, { marginBottom: 10, color: COLORS.BLACK }]}>{(this.state.currentItem.final_price) ? ("$" + this.state.currentItem.final_price) : "$0.0"}</Text>
              }

              {/* <Text style={styles.modalPrice}>{(this.state.currentItem.price) ? ("$" + this.state.currentItem.price) : "$0.0"}</Text> */}
              <TouchableOpacity
                disabled={(this.state.currentItem.quantity > 0) ? false : true}
                style={(this.state.currentItem.quantity > 0) ?
                  styles.modalBtn : styles.modalBtnDisabled}

                onPress={() => {
                  CartStore.addToCart(this.state.currentItem.id, 1);
                }}>
                {this.state.currentItem.quantity > 0 ?
                  <Text style={styles.modalBtnText} 
                        numberOfLines={1}>Add To Cart</Text>
                  :
                  <Text style={styles.modalBtnOutOfStockText} 
                        numberOfLines={1}>Out Of Stock</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                // this.setState({ isDialogVisible: false });
                this.onStarClick(this.state.currentItem, this.state.currentIndex)
              }}>
                <Image style={{ tintColor: (this.state.currentItem.is_favourite) ? 'red' : 'white' }} source={require('../../resources/img/wishlist_icon.png')} />
                <Text style={styles.modalBtnText} 
                      numberOfLines={1}> Wish List</Text>
              </TouchableOpacity>
              <Text style={styles.moreDetailText} 
                    numberOfLines={1}
                onPress={async () => {

                  let res = await ProductStore.getProdDetail(this.state.currentItem.id);

                  if (res) {
                    if (res.error) {
                      showLog("CAT PROD LIST ==> " + res.error)
                      showAlert(res.error)
                    }
                    else {
                      if (ProductStore.productDetail.id) {
                        this.setState({ isDialogVisible: false });

                        this.props.navigator.push({
                          screen: 'hairfolio.ProductDetail',
                          navigatorStyle: NavigatorStyles.tab,
                          passProps: {
                            prod_id: this.state.currentItem.id,
                            categoryTitle: (this.state.currentItem.name) ? this.state.currentItem.name : '',
                            isFrom: "categoryProductList"
                            // (this.state.productArr.name) ? this.state.productArr.name : ''   
                          }
                        });

                      }
                    }

                  }
                }}
              >See full details</Text>
            </View>

          </View>

        </Modal>

        <View style={[styles.container, { paddingTop: 10, paddingBottom: 10 }]}>


          <Image
            style={styles.backgroundStyle}
            defaultSource={placeholder_icon}
            source={(this.state.currentItem.product_image) ?
              { uri: this.state.currentItem.product_image } :
              placeholder_icon} />


          <View style={{ width: windowWidth / 1.8 }}>
            <Text style={styles.categoryName}
              numberOfLines={1}>
              {(this.state.currentItem.name) ? this.state.currentItem.name : ''}
            </Text>

            <Text style={styles.subCategoryName}
              numberOfLines={1}>
              {(this.state.currentItem.product_brand) ?
                this.state.currentItem.product_brand.name : ""}
            </Text>
            {
              (this.state.productArr) ?

                <ScrollView
                  bounces={false}
                  style={styles.scrollStyle}
                  horizontal={true}
                >
                  {this.state.productArr.map((data, index) => {
                    return (
                      <View style={styles.productListingWrapper}>
                        <TouchableOpacity style={styles.productTouchable}
                          onPress={
                            () => {
                              this.setState({
                                currentItem: data,
                                currentIndex: index,
                                isDialogVisible: true
                              });
                            }}>
                          <Image
                            defaultSource={placeholder_icon}
                            // source={(data.product_image) ? { uri: BASE_URL + data.product_image } : require('img/medium_placeholder_icon.png')}
                            source={(data.product_thumb) ?
                              { uri: data.product_thumb } :
                              placeholder_icon}
                            onError={() => {
                              data.product_thumb = data.product_image;
                            }}
                            style={styles.productImage} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.starTouchable}
                          onPress={() => { this.onStarClick(data, index) }} >
                          <Image
                            style={styles.starTouchable}
                            source={(data.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')} />
                        </TouchableOpacity>
                        <Text style={styles.productName} numberOfLines={1}>
                          {data.name}
                        </Text>
                      </View>
                    )
                  })}
                </ScrollView>
                :
                null
            }

          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.WHITE,
    height: windowWidth,
  },
  cartIcon: {
    width: h(44),
    height: h(42),
    alignSelf: "flex-end",
    marginRight: 15
  },
  backgroundStyle: {
    width: windowWidth,
    height: null,
    flex: 1,
    resizeMode: 'contain'
  },
  scrollStyle: {
    width: windowWidth - 15,
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 2
  },
  productListingWrapper: {
    width: h(220),
    marginRight: 5,
  },
  productTouchable: {
    height: h(300), width: h(220),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    },
    backgroundColor: 'white'
  },
  productImage: {
    height: h(300),
    width: h(220),
    borderRadius: 5,
    resizeMode: 'contain'
  },
  productName: {
    fontFamily: FONTS.LIGHT,
    fontSize: h(24),
    textAlign: "center",
    color: COLORS.DARK,
    backgroundColor: 'transparent',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  categoryName: {
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    fontSize: h(30),
    paddingTop: 5,
    marginLeft: 5
  },
  subCategoryName: {
    color: COLORS.DARK,
    fontFamily: FONTS.LIGHT,
    fontSize: h(24),
    paddingBottom: 5,
    marginLeft: 5
  },
  modalView: {
    width: windowWidth - 30,
    height: windowHeight / 3,
    backgroundColor: COLORS.BACKGROUND_SEARCH_FIELD,
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    padding: 15,
    flexDirection: 'row',
    zIndex:9999999
  },
  modalImageView: {
    width: windowWidth / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  modalImageStyle: {
    height: (windowHeight / 3) - 30,
    width: windowWidth / 2,
    borderRadius: 5,
    resizeMode: 'contain'
  },
  modalTextView: {
    flex: 1,
    marginLeft: 20,
  },
  modalName: {
    color: COLORS.BLACK,
    fontFamily: FONTS.ROMAN,
    fontSize: h(30),
    marginTop: 10
  },
  modalSubName: {
    color: COLORS.DARK,
    fontFamily: FONTS.LIGHT,
    fontSize: h(25),
  },
  modalPrice: {
    color: COLORS.GRAY2,
    fontFamily: FONTS.ROMAN,
    fontSize: (windowHeight > 600) ? h(27) : h(22),
    // marginBottom: 10,
    textDecorationLine: 'line-through'
  },
  modalFinalPrice: {
    color: COLORS.DISCOUNT_RED,
    fontFamily: FONTS.ROMAN,
    fontSize: (windowHeight > 600) ? h(27) : h(22),
    // marginBottom: 10
  },
  modalBtn: {
    backgroundColor: COLORS.DARK2,
    width: '100%',
    height: (windowHeight > 600) ? 30 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row'
  },
  modalBtnText: {
    color: COLORS.WHITE,
    fontSize: (windowHeight > 600) ? h(30) :  h(22),
    fontFamily: FONTS.ROMAN,
    textAlign: 'center',
  },
  modalBtnOutOfStockText: {
    color: COLORS.BLACK,
    fontSize: (windowHeight > 600) ? h(30) : h(20),
    fontFamily: FONTS.MEDIUM,
    textAlign: 'center',
  },
  modalBtnDisabled: {
    backgroundColor: COLORS.LIGHT,
    width: '100%',
    height: (windowHeight > 600) ? 30 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row'
  },
  moreDetailText: {
    marginTop: (windowHeight > 600) ? 15 : 10,
    color: COLORS.BLACK,
    fontSize: (windowHeight > 600) ? h(30) : h(22),
    fontFamily: FONTS.ROMAN,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  modalShareView: {
    position: 'absolute',
    top: 7,
    right: 7,
    height: 15,
    width: 15,
  },
  modalShareIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain'
  },
  starTouchable: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5
  },

  modalCloseView: {
    position: 'absolute',
    top: 7,
    right: 7,
    height: 22,
    width: 22,
    backgroundColor: COLORS.DARK2,
    zIndex: 999999999999,
    alignItems: "flex-start",
    borderRadius: 22
  },
  modalCloseIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
  }
});