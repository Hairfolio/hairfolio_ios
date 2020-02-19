import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, h, SCALE } from '../../style';
import { showLog } from '../../helpers';

export default class CartProductRow extends Component {

  constructor(props) {
    super(props);
    showLog("PRODUCT CartProductRow ==> "+JSON.stringify(this.props.obj))
    
  }

  render() {
    let placeholder_icon = require('img/medium_placeholder_icon.png');
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
              (this.props.obj.product.product_thumb)
                ?
                <Image
                  style={styles.productImage}
                  onError={()=>{
                    this.props.obj.product.product_thumb = this.props.obj.product.product_image.url;
                  }}
                  defaultSource={placeholder_icon}
                  source={{ uri: this.props.obj.product.product_thumb }}
                />
                :
                <Image
                  style={styles.productImage}
                  source={require('img/medium_placeholder_icon.png')}  
                />
            }

          </View>

          <View style={styles.productDesc}>
            <Text numberOfLines={2} 
                  style={styles.labelProductTitleText}
                  >{this.props.obj.product.name}</Text>
            {
              (this.props.obj.product.product_brand != null) ?
              <Text style={styles.labelProductTitleText}
                    numberOfLines={2}>{this.props.obj.product.product_brand.title}</Text>
              :
              null
            }

            {(this.props.obj.product.discount_percentage != null) ?

              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.priceLabelText}>${this.props.obj.product.price}</Text>
                  <Text style={styles.finalPriceLabelText}>   ${this.props.obj.product.final_price}</Text>
                </View>
                <Text style={[styles.finalPriceLabelText]}>{this.props.obj.product.discount_percentage}% off</Text>
              </View>

            :
            <Text style={[styles.finalPriceLabelText, { color: COLORS.BLACK }]}>${this.props.obj.product.final_price}</Text>
            }
          </View>

          <View style={[styles.imgWrap]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop:40 }}>
              <TouchableOpacity style={(this.props.obj.units > 1)? styles.outline:styles.outlineDisabled} 
              
              disabled={(this.props.obj.units > 1)? false : true}
              onPress={() => {
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
                <Image style={(this.props.obj.units > 1) ? 
                              styles.qtyImg : styles.qtyImgDisabled} source={require('img/subtrstion_icon.png')} />
              </TouchableOpacity>
              <Text style={styles.labelText}> {this.props.obj.units} </Text>
              <TouchableOpacity style={(this.props.obj.product.quantity > this.props.str.cartProducts[this.props.keyIndex].units)?
                                styles.outline : styles.outlineDisabled}
                 disabled={(this.props.obj.product.quantity > this.props.str.cartProducts[this.props.keyIndex].units)?
                                           false : true}
              
                onPress={() => {
                  
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
                <Image style={(this.props.obj.product.quantity > this.props.str.cartProducts[this.props.keyIndex].units)?
                                  styles.qtyImg : styles.qtyImgDisabled} 
                  
                    source={require('img/add_icon.png')} />
              </TouchableOpacity>
            </View>

            {this.props.showUpdate ?
              <View>
                <Text style={styles.labelUpdateText}
                  onPress={() => {
                    this.props.str.updateCart(this.props.obj.product.id, this.props.obj.units, this.props.keyIndex,true)
                    

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
    flex:1,
    resizeMode:'contain',
    alignSelf:"center",
    // height: h(220),
    height:null,
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
  qtyImgDisabled: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding: 5,
    tintColor: COLORS.GRAY2
  },
  qtyImg: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding: 5,
  },
  outline: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    
  },
  outlineDisabled: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderColor:COLORS.GRAY2
  },

  labelText: {
    fontSize: SCALE.h(35),
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
    color: COLORS.GRAY2,
    marginTop: 2,
    textDecorationLine: 'line-through'
  },
  finalPriceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.HEAVY,
    color: COLORS.DISCOUNT_RED,
    marginTop: 2
  },
});
