import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import CartProductRow from '../components/cart/CartProductRow';
import PlaceHolderText from '../components/PlaceHolderText';
import { showLog, windowWidth, showAlert } from '../helpers';
import CartStore from '../mobx/stores/hfStore/CartStore';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';
import { COLORS, FONTS, h, SCALE } from '../style';

@observer
export default class CartList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cartProductsArr: [{}, {}, {}],
      totalPrice: 0
    }
  }

  async gotoAddressScreen(store) {


    let isUpdate = await CartStore.fetchCart2();

    // alert(isUpdate)
    if (isUpdate) {
      // if (CartStore.showAl) {
      // CartStore.showAl = false;
      showAlert("Cart Updated")
      // }
    }
    else {
      if (!store.showUpdateButton) {
        this.props.navigator.push({
          screen: 'hairfolio.CartAddress',
          navigatorStyle: NavigatorStyles.tab,
        });
      }
      else {
        showAlert("Update first")
      }
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    CouponListStore.selectedID = "";
    CouponListStore.couponDiscount = "";
    CartStore.fetchCart2();
    // CartStore.fetchCart2();
    // if (CartStore.showAl) {
    //   CartStore.showAl = false;
    //   showAlert("Cart updated");
    // }
  }

  componentWillUnmount() {
    StatusBar.setBarStyle('dark-content')
    CouponListStore.couponDiscount = "";
    CouponListStore.discountRate=0;
  }


  async removeItemFromCart(prodId) {

    Alert.alert(
      'Do you really want to delete this item ?',
      '', [{
        text: 'Yes',
        onPress: async () => {
          let res = await CartStore.removeFromCart(prodId);
          if (res) {
            CartStore.isFirstCallApi = true
            CartStore.fetchCart();
          }
        }
      }, {
        text: 'No',
        onPress: () => {

        }
      }], {
        cancelable: false
      }
    );

  }

  render() {
    let store = CartStore;

    if (store.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return (
      <View style={styles.wrapper}>
        <BlackHeader
          onLeft={() => {

            this.props.navigator.pop({ animated: true })
            StatusBar.setBarStyle('dark-content')
          }}
          title='Shopping Cart' />
        <KeyboardAwareScrollView>

          {
            (store.cartProducts.length > 0)
              ?

              <View style={styles.mainContainer}>

                {store.cartProducts.map((data, index) => {
                  showLog("cartlist ==>" + JSON.stringify(data));

                  if (data.product != null) {
                    let prod_id = data.product.id;
                    showLog("prod_id ==>" + JSON.stringify(prod_id));

                    return (
                      <CartProductRow str={store}
                        keyIndex={index}
                        obj={data}
                        showUpdate={store.tempCartProducts[index].units != store.cartProducts[index].units ? true : false}
                        // showUpdate = {store.showUpdateButton ? true : false}
                        onPress={() => { this.removeItemFromCart(prod_id) }}
                      // onPressUpdate={()=>{showAlert("Update API Called")}}
                      />
                    )
                  }
                  else {
                    return null;
                  }

                }
                )}

                <View style={[styles.headerContainer, { marginTop: 10 }]}>
                  <Text style={styles.categoryTitle}>Total items in cart</Text>
                  <Text style={styles.categoryTitle}>{store.totalItems}</Text>
                </View>

                {
                  CouponListStore.couponDiscount == "" ?
                    <View style={styles.removeApplyContainer}>
                      <Text style={styles.applyCouponText}
                        onPress={() => {

                          this.props.navigator.push({
                            screen: 'hairfolio.CouponList',
                            navigatorStyle: NavigatorStyles.tab,

                          });
                        }}
                      >Apply Coupon</Text>
                      <Text style={styles.applyCouponTextVal}></Text>
                    </View>

                    :

                    CouponListStore.couponDiscount != "" ?
                      <View style={{ marginTop: 5 }}>
                        <View style={styles.removeApplyContainer}>
                          <Text style={styles.appliedCouponText}>Applied Coupon Discount</Text>
                          <Text style={styles.appliedCouponTextVal}>${parseFloat(CouponListStore.discountRate).toFixed(2)}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={styles.removeCouponText}
                            onPress={() => {

                              // let disPrice = store.totalPrice*10/100
                              let originalPrice = store.totalPrice + CouponListStore.discountRate
                              store.totalPrice = parseFloat(originalPrice).toFixed(2);
                              CouponListStore.couponDiscount = "";
                            }}
                          >Remove Coupon</Text>
                        </View>
                      </View>
                      :
                      null
                }

                <View style={styles.dividerStyle} />

                <View style={[styles.headerContainer, { marginTop: 10 }]}>
                  <Text style={styles.labelProductTitleText} >Total</Text>
                  <Text style={styles.priceLabelLight}>${parseFloat(store.totalPrice).toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    marginTop: 30,
                    backgroundColor: (store.showUpdateButton) ?
                      COLORS.LIGHT : COLORS.DARK,
                    width: windowWidth - 60,
                    height: 35,
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                  disabled={store.showUpdateButton ? true : false}
                  onPress={() => { this.gotoAddressScreen(store) }}
                >
                  <Text style={(store.showUpdateButton) ? styles.btnTextDisabled : styles.btnText} >Place Order</Text>
                </TouchableOpacity>

              </View>
              :
              <PlaceHolderText message="Your cart is empty" />
          }

        </KeyboardAwareScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  mainContainer: {
    padding: 15,
    flex: 1,
  },
  productImage: {
    borderRadius: 5,
    height: h(220),
    width: h(220),
  },
  imageWrapper: {
    height: h(220),
    width: h(220),
    borderRadius: 5,
    justifyContent: 'center',
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    }
  },
  imgWrap: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  qtyImg: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding: 5,
  },
  outline: {
    width: 15,
    height: 15,
    borderRadius: 7,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  rowDirectionWrapper: {
    flexDirection: 'row'
  },
  productDesc: {
    flex: 1,
    padding: 15
  },
  labelProductTitleText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK
  },
  labelTextLight: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.ROMAN,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  categoryTitle: {
    fontSize: SCALE.h(28),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK
  },
  applyCouponTitle: {
    fontSize: SCALE.h(28),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT
  },
  btnTextDisabled: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.DARK
  },
  applyCouponText: {
    alignSelf: 'flex-start',
    fontSize: SCALE.h(30),
    fontFamily: FONTS.BLACK,
    color: COLORS.WHITE,
    // backgroundColor: COLORS.WHITE,
    backgroundColor: COLORS.GREEN,
    padding: 5,
    shadowColor: '#000000',
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 1,
  },
  applyCouponTextVal: {
    alignSelf: 'flex-end',

  },
  removeCouponText: {
    alignSelf: 'flex-start',
    fontSize: SCALE.h(30),
    fontFamily: FONTS.BLACK,
    color: COLORS.DARK,
    backgroundColor: COLORS.WHITE,
    padding: 5,
    shadowColor: '#000000',
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 1,
  },

  appliedCouponText: {
    alignSelf: 'flex-start'
  },
  appliedCouponTextVal: {
    alignSelf: 'flex-end',

  },
  removeApplyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  dividerStyle: {
    width: windowWidth - 30,
    marginTop: 10,
    marginLeft: 5,
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY1
  }

});
