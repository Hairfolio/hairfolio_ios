import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import PreviewOrderProductRow from "../components/cart/PreviewOrderProductRow";
import { windowWidth } from "../helpers";
import { COLORS, FONTS, h, SCALE } from "../style";

@observer
@autobind
export default class PreviewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartProductsArr: [{}, {}, {}]
    };
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title="Order"
        />
        <KeyboardAwareScrollView>
          <View style={styles.mainContainer}>
            {this.state.cartProductsArr.map(data => {
              return <PreviewOrderProductRow product={data} />;
            })}

            <View style={styles.headerContainer}>
              <Text style={styles.categoryTitle}>Delivery Charge</Text>

              <Text style={styles.categoryTitle}>$50.00</Text>
            </View>

            <View style={[styles.headerContainer, { marginTop: 10 }]}>
              <Text style={styles.categoryTitle}>Value Added Charges</Text>

              <Text style={styles.categoryTitle}>$2.00</Text>
            </View>

            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED,
                marginTop: 10,
                marginBottom: 10
              }}
            />

            <View style={styles.headerContainer}>
              <Text style={styles.labelProductTitleText}>Total</Text>

              <Text style={styles.labelProductTitleText}>$482.00</Text>
            </View>

            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED,
                marginTop: 10,
                marginBottom: 10
              }}
            />

            <View style={[styles.rowDirectionWrapper, { paddingTop: 10 }]}>
              <Image
                source={require("img/location_pin.png")}
                style={styles.location}
              />
              <Text style={styles.labelProductTitleText}> Address </Text>
            </View>

            <Text style={styles.UserNameText}>Joan Doie</Text>

            <Text style={styles.AddressLight}>
              889 Second Floor Street NH 2565 United States
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
                this.props.navigator.push({
                  screen: "hairfolio.CheckoutMethods",
                  title: "CheckOut",
                  navigatorStyle: NavigatorStyles.tab
                });
              }}
            >
              <Text style={styles.btnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
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
  }
});
