import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, h, SCALE } from '../../style';

export default class OrderHistoryRow extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.rowDirectionWrapper}>

          <TouchableOpacity style={{
            borderRadius: 24,
            backgroundColor: COLORS.DARK2,
            height: 24,
            width: 24,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 0,
            opacity: 0.5,
            zIndex: 11
          }} onPress={this.props.onPress}>
            <Text style={{
              color: COLORS.WHITE,
              fontFamily: FONTS.MEDIUM,
              fontSize: 16,
              position: "absolute"
            }}>x</Text>

          </TouchableOpacity>

          <View style={styles.imageWrapper}>

            {
              (this.props.obj.product.product_image.url)
                ?
                <Image
                  style={styles.productImage}
                  source={{ uri: this.props.obj.product.product_image.url }}
                />
                :
                <Image
                  style={styles.productImage}
                  source={require('img/hair_dryer_image_1.png')}
                />
            }

          </View>

          <View style={styles.productDesc}>
            <Text style={styles.labelProductTitleText}>{this.props.obj.product.name}</Text>
            <Text style={styles.priceLabelText}> ${this.props.obj.product.price}</Text>
          </View>

          <View style={[styles.imgWrap]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop:40 }}>
              <TouchableOpacity style={styles.outline} onPress={() => {
                if (this.props.obj.units > 1) {
                  if(this.props.obj.product.quantity >= this.props.str.cartProducts[this.props.keyIndex].units){
                    this.props.obj.units = this.props.obj.units - 1;
                    this.props.str.cartProducts[this.props.keyIndex].units = this.props.obj.units;
                    var flag = false;
                    for(var i=0;i<this.props.str.cartProducts.length;i++) {
                      if (this.props.str.tempCartProducts[i].units != this.props.str.cartProducts[i].units) {
                        flag = false;
                        break;
                      } else {
                        flag = true;
                      }
                    }
                    if(!flag)
                      this.props.str.showUpdateButton = true;
                    else
                      this.props.str.showUpdateButton = false;
                  }
                }
              }}>
                <Image style={styles.qtyImg} source={require('img/subtrstion_icon.png')} />
              </TouchableOpacity>
              <Text style={styles.labelText}> {this.props.obj.units} </Text>
              <TouchableOpacity style={styles.outline} onPress={() => {
                if(this.props.obj.product.quantity > this.props.str.cartProducts[this.props.keyIndex].units) {
                  this.props.obj.units = this.props.obj.units + 1;
                  this.props.str.cartProducts[this.props.keyIndex].units = this.props.obj.units;
                  var flag = false;
                  for(var i=0;i<this.props.str.cartProducts.length;i++) {
                    if (this.props.str.tempCartProducts[i].units != this.props.str.cartProducts[i].units) {
                      flag = false;
                      break;
                    } else {
                      flag = true;
                    }
                  }
                  if(!flag)
                    this.props.str.showUpdateButton = true;
                  else
                    this.props.str.showUpdateButton = false;
                }
              }}>
                <Image style={styles.qtyImg} source={require('img/add_icon.png')} />
              </TouchableOpacity>
            </View>

            {this.props.showUpdate ?
              <View>
                <Text style={styles.labelUpdateText}
                  onPress={() => {
                    this.props.str.updateCart(this.props.obj.product.id, this.props.obj.units, this.props.keyIndex)
                  }}> Update </Text>
              </View>
              :
              null
            }

          </View>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED, marginTop: 15, marginBottom: 15 }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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
    flexDirection: "column",
    justifyContent: "space-between",
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
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.DARK,
    padding: 5
  },
  rowDirectionWrapper: {
    flexDirection: 'row',
  },
  productDesc: {
    flex: 1,
    padding: 15,
  },
  labelProductTitleText: {
    fontSize: SCALE.h(27),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK
  },
  labelUpdateText: {
    fontSize: SCALE.h(27),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
    marginRight: 2,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  labelTextLight: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.ROMAN,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  priceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.HEAVY,
    color: COLORS.BLACK,
    marginTop: 2
  },
});
