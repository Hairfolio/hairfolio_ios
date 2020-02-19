import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackHeader from '../components/BlackHeader';
import { windowWidth } from '../helpers';
import { COLORS, FONTS, h, SCALE } from '../style';


@observer
@autobind
export default class ConfirmOrder extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <BlackHeader
          onLeft={() => this.props.navigator.pop({ animated: true })}
          title='Confirm Order' />
        <View style={styles.mainContainer}>
          <View style={styles.rowDirectionWrapper}>
            <View style={styles.imageWrapper}>
              <Image
                style={styles.productImage}
                source={require('img/medium_placeholder_icon.png')}
              // source={data.cloudinary_url}
              />
            </View>

            <View style={styles.productDesc}>
              <Text style={styles.labelProductTitleText}>L'Ange Hair Dryer</Text>
              <Text style={styles.labelTextLight}>Jetblack Ltd </Text>
              {/* <View style={[styles.rowDirectionWrapper, { alignItems: 'center' }]}>
                <Text style={styles.labelTextLight}>Color </Text>
                <View style={{ backgroundColor: COLORS.BLACK, width: 10, height: 10 }}></View>
              </View> */}
              <Text style={styles.priceLabelText}>$220</Text>
            </View>

            <View style={[styles.imgWrap, { alignItems: "center" }]}>
              <View style={styles.outline}>
                <Image style={styles.qtyImg} source={require('img/subtrstion_icon.png')} />
              </View>
              <Text style={[styles.labelText, { padding: 5 }]}> 2 </Text>
              <View style={styles.outline}>
                <Image style={styles.qtyImg} source={require('img/add_icon.png')} />
              </View>
            </View>
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED, marginTop: 15 }}></View>



          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.labelText, { fontFamily: FONTS.ROMAN }]}>Your Order Placed Successfully</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.labelTextLight, { fontSize: SCALE.h(25) }]}>Order:</Text><Text style={[styles.labelTextLight, { fontSize: SCALE.h(25) }]}>#GHJ125456</Text>
              </View>
              <Text style={styles.labelTextLighter}>Except time to be Delivered Within</Text>
              <Text style={styles.labelTextLighter}>5 Working Day</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                backgroundColor: COLORS.DARK,
                width: windowWidth - 60,
                height: 35,
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.btnText} onPress={() => {
                this.props.navigator.pop({ animated: true })
              }}>Go Back To Home</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 0.2 }}></View>
        </View>
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
    // borderRadius: 5,
    // height: h(220),
    // width: h(220),

    borderRadius: 5,
    flex:1,
    resizeMode:'contain',
    // height: h(220),
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
  labelText: {
    fontSize: SCALE.h(27),
    fontFamily: FONTS.ROMAN,
    color: COLORS.BLACK
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
    fontFamily: FONTS.ROMAN,
    color: COLORS.BLACK
  },
  labelTextLight: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK
  },
  priceLabelText: {
    fontSize: SCALE.h(27),
    fontFamily: FONTS.ROMAN,
    color: COLORS.BLACK
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT
  },
  labelTextLighter: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.LIGHT,
    color: COLORS.DARK
  }
});
