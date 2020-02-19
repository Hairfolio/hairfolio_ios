import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import React, { Component } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,moment } from '../helpers';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import PreviewOrderProductRow from "../components/cart/PreviewOrderProductRow";
import { windowWidth, showLog } from "../helpers";
import { COLORS, FONTS, h, SCALE } from "../style";
import CartStore from '../mobx/stores/hfStore/CartStore';
import AddressStore from '../mobx/stores/hfStore/CartAddressStore';
import CardStore from '../mobx/stores/hfStore/CardAndPlaceOrderStore';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';
import OrderDetailRow from "../components/Orders/OrderDetailRow";
import PlaceHolderText from "../components/PlaceHolderText";

@observer
@autobind
export default class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: this.props.orderDetail.order_details,
      orderDate : moment(this.props.orderDetail.created_at).format("DD MMMM YYYY, hh:mm a"),
      orderNumber : this.props.orderDetail.order_number,
      address : this.props.orderDetail.address,
      wallet_amount : this.props.orderDetail.wallet_amount,
      coupon_amount : this.props.orderDetail.coupon_amount,
      totalAmount : this.props.orderDetail.final_amount,
      actualAmount : this.props.orderDetail.amount,
      discountAmount : this.props.orderDetail.discount
    };

    
    showLog("ORDER DETAILS IN ORDER SCREEN ==> " + JSON.stringify(this.props.orderDetail))
        
    // CartStore.fetchWallet()


  }

  render() {
    let store = CartStore;

    return (
      <View style={styles.wrapper}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title="Order"
        />
        <KeyboardAwareScrollView>


          {
            (this.state.orderDetails.length > 0)
              ?

              <View style={styles.mainContainer}>

                <View>
                    <Text style={[styles.labelProductTitleText,{marginTop:5, fontFamily: FONTS.ROMAN}]}>Order Date: {this.state.orderDate}</Text>
                    <Text style={[styles.labelProductTitleText,{marginTop:5,marginBottom:5, fontFamily: FONTS.ROMAN}]}>Order Number: {this.state.orderNumber}</Text>
                </View>

               {this.state.orderDetails.map(data => {
                  return <OrderDetailRow product={data} />;
                })}

                <View style={{ marginTop: 5 }}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.labelProductTitleText}>Grand Total</Text>

                    <Text style={styles.labelProductTitleText}>${this.state.actualAmount.toFixed(2)}</Text>
                  </View>
                </View>


                {
                 this.state.discountAmount > 0 ?
                    <View style={{ marginTop: 5 }}>
                      <View style={styles.removeApplyContainer}>
                        <Text style={styles.appliedCouponText}>Total Discount</Text>
                        <Text style={[styles.appliedCouponTextVal,{fontFamily:FONTS.ROMAN}]}>${this.state.discountAmount.toFixed(2)}</Text>
                      </View>
                    </View>
                    :
                    null
                }

                {
                 this.state.coupon_amount > 0 ?
                    <View style={{ marginTop: 5 }}>
                      <View style={styles.removeApplyContainer}>
                        <Text style={styles.appliedCouponText}>Applied Coupon Discount</Text>
                        <Text style={[styles.appliedCouponTextVal,{fontFamily:FONTS.ROMAN}]}>${this.state.coupon_amount.toFixed(2)}</Text>
                      </View>
                    </View>
                    :
                    null
                }
                <View style={{ marginTop: 5 }}>
                  <View style={styles.removeApplyContainer}>
                    <Text style={styles.appliedCouponText}>Wallet Amount</Text>
                    {this.state.wallet_amount > 0 ? 
                        <Text style={styles.appliedCouponTextVal}>${this.state.wallet_amount.toFixed(2)}</Text>
                      :
                        <Text style={styles.appliedCouponTextVal}>${this.state.wallet_amount}</Text>
                      }
                    
                  </View>
                </View>


                <View style={{ marginTop: 5 }}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.labelProductTitleText}>Total Paid Amount</Text>
                    <Text style={styles.labelProductTitleText}>${this.state.totalAmount.toFixed(2)}</Text>
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

                <Text style={styles.UserNameText}>{this.state.address.first_name} {this.state.address.last_name}</Text>

                <Text style={styles.AddressLight}>
                  {this.state.address.user_address +"\n"+
                  ((this.state.address.landmark!=null && this.state.address.landmark.length > 0) ? this.state.address.landmark+", " : "")+this.state.address.zip_code+"\n"+
                  this.state.address.city
                  }
                </Text>

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
    alignSelf: 'flex-start',
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.BLACK
  },
  appliedCouponTextVal: {
    alignSelf: 'flex-end',

  },
  removeApplyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10
  },
});
