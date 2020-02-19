import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import PreviewOrderProductRow from "../components/cart/PreviewOrderProductRow";
import { windowWidth, showLog, showAlert } from "../helpers";
import { COLORS, FONTS, h, SCALE } from "../style";
import CartStore from '../mobx/stores/hfStore/CartStore';
import AddressStore from '../mobx/stores/hfStore/CartAddressStore';
import CardStore from '../mobx/stores/hfStore/CardAndPlaceOrderStore';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';
import PlaceHolderText from "../components/PlaceHolderText";

// let fetchedProducts;


@observer
@autobind
export default class PreviewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartProductsArr: [{}, {}, {}]
    };

   CartStore.fetchCart();

    showLog("Address Store ==> " + JSON.stringify(AddressStore.addresses))

    CartStore.fetchWallet()
  }

  // componentWillMount() {
  //   StatusBar.setBarStyle('light-content');
  //   CouponListStore.selectedID = "";
  //   CouponListStore.couponDiscount = "";
  //   CartStore.fetchWallet();
  // }




  async checkIfCartUpdated(){

    let isUpdated = await CartStore.fetchCart2();

    if(isUpdated)
    {
      Alert.alert(
        'Hairfolio',
        "Cart Updated.",
        [
          { text: "OK", onPress: () => {
            this.props.navigator.pop({animated:false})
            this.props.navigator.pop({animated:false})
          } },
         
        ],
        { cancelable: false }
      );
            
    }
    else
    {
      //When products are not updated
      this.checkOut();
    }

  }


  checkOut(){


    if(CartStore.walletAmount>CartStore.totalPrice)
    {
      CardStore.placeOrder(this.props.navigator,true)
    }
    else
    {
      this.props.navigator.push({
       screen: "hairfolio.CheckoutMethods",
       title: "CheckOut",
       navigatorStyle: NavigatorStyles.tab
      });
    }
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
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title="Order"
        />
        <KeyboardAwareScrollView>

          {
            (store.cartProducts.length > 0)
              ?

              <View style={styles.mainContainer}>
                {store.cartProducts.map(data => {
                  if(data.product != null)
                  {
                    return <PreviewOrderProductRow product={data} />;
                  }
                  else
                  {
                    return null;
                  }
                  
                })}


                {
                  CouponListStore.couponDiscount != "" ?
                    <View style={{ marginTop: 5 }}>
                      <View style={styles.removeApplyContainer}>
                        <Text style={styles.appliedCouponText}>Applied Coupon Discount</Text>
                        <Text style={styles.appliedCouponTextVal}>${parseFloat(CouponListStore.discountRate).toFixed(2)}</Text>
                      </View>
                    </View>
                    :
                    null
                }

                <View style={{ marginTop: 5 }}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.labelProductTitleText}>Total</Text>

                    <Text style={styles.labelProductTitleText}>${parseFloat(CartStore.totalPrice).toFixed(2)}</Text>
                  </View>
                </View>

                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED,
                    marginTop: 10,
                    marginBottom: 10
                  }}
                />


                <View style={{ marginTop: 5 }}>
                  <View style={styles.removeApplyContainer}>
                    <Text style={styles.appliedCouponText}>Wallet Balance</Text>
                    <Text style={styles.appliedCouponTextVal}>${CartStore.walletAmount}</Text>
                  </View>
                </View>


                <View style={{ marginTop: 5 }}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.labelProductTitleText}>Total Payable Amount</Text>
                    <Text style={styles.labelProductTitleText}>${CartStore.totalPayableAmount.toFixed(2)}</Text>
                  </View>
                </View>

                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED,
                    marginTop: 10,
                    marginBottom: 10
                  }}
                />

                <View style={[styles.rowDirectionWrapper, { paddingTop: 10, marginTop: 10 }]}>
                  <Image
                    source={require("img/location_pin.png")}
                    style={styles.location}
                  />
                  <Text style={styles.labelProductTitleText}> Address </Text>
                </View>

                <Text style={styles.UserNameText}>{AddressStore.default_address.first_name} {AddressStore.default_address.last_name}</Text>

                {/* <Text style={styles.AddressLight}>
              889 Second Floor Street NH 2565 United States
            </Text> */}
                <Text style={styles.AddressLight}>
                  {AddressStore.default_address.user_address+"\n"+
                  ((AddressStore.default_address.landmark != null && AddressStore.default_address.landmark.length > 0) ? AddressStore.default_address.landmark+", " : "" )+AddressStore.default_address.zip_code+"\n"+
                  AddressStore.default_address.city}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    marginTop: 30,
                    backgroundColor: COLORS.DARK,
                    width: windowWidth - 60,
                    height: 35,
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                  onPress={() => {


                    this.checkIfCartUpdated()
                    
                  }}
                >
                {CartStore.walletAmount>CartStore.totalPrice ? 
                  <Text style={styles.btnText}>Pay From Wallet</Text>
                  :
                  <Text style={styles.btnText}>Checkout</Text>
                  }
                  
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
    flex: 1
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  mainContainer: {
    padding: 15,
    flex: 1
  },
  productImage: {
    borderRadius: 5,
    height: h(220),
    width: h(220)
  },
  imageWrapper: {
    height: h(220),
    width: h(220),
    borderRadius: 5,
    justifyContent: "center",
    elevation: 1,
    shadowOpacity: 0.1,
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
    padding: 5
  },
  outline: {
    width: 15,
    height: 15,
    borderRadius: 7,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  labelText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    padding: 5
  },
  rowDirectionWrapper: {
    flexDirection: "row"
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
  UserNameText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    paddingTop: 2,
    color: COLORS.BLACK
  },
  labelTextLight: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.ROMAN,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  categoryTitle: {
    fontSize: SCALE.h(27),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK
    // color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  priceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM
    // color: COLORS.SEARCH_LIST_ITEM_COLOR
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
  location: {
    width: 15,
    height: 15,
    resizeMode: "contain"
  },
  AddressLight: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.LIGHT,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
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
});
