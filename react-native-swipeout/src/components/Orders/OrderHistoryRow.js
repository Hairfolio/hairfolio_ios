import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { showLog, windowWidth } from '../../helpers';
import { COLORS, FONTS, h, SCALE } from '../../style';

export default class OrderHistoryRow extends Component {

  constructor(props) {
    super(props);

    showLog("ORDER HISTORY ROW DATA ==>"+JSON.stringify(this.props.product.order_details[0].product))

    // alert(JSON.stringify(this.props.product.order_details[0].product))

  }


  render() {
    let placeholder_icon = require('img/medium_placeholder_icon.png');
    // showLog("ORDER HISTORY ==> "+JSON.stringify(this.props.product))
    return (
      <TouchableOpacity onPress={this.props.onPressOrder}>
        <View style={styles.rowDirectionWrapper}>


          <View style={styles.imageWrapper}>

            {
              (this.props.product.order_details[0].product)
                ?
                <Image
                  style={styles.productImage}
                  defaultSource={placeholder_icon}
                  onError={()=>{
                            let img = this.props.product.order_details[0].product;
                            this.props.product.order_details[0].product.product_thumb = img.product_image.url;
                            }} 
                  source={{ uri: this.props.product.order_details[0].product.product_thumb }}
                />
                :
                <Image
                  style={styles.productImage}
                  // source={require('img/hair_dryer_image_1.png')}
                  // source={{ uri: this.props.product.order_details[0].product.product_image }}
                  source={placeholder_icon}                  
                />
            }

          </View>
          <View>
          <View style={styles.productDesc}>
            <Text style={styles.labelProductTitleText}>{this.props.product.order_number}</Text>
            <Text style={styles.priceLabelText}> ${parseFloat(this.props.product.final_amount).toFixed(2)} </Text>
            {/* <Text style={styles.priceLabelText}> Quantity:{this.props.product.order_details[0].quantity} </Text> */}
          </View>
          
          
          {!this.props.isPending ? 
             <TouchableOpacity style={styles.updateParentView}
                                onPress={this.props.onPress}>
              <Text style={styles.labelUpdateText}> Track Now </Text>
            </TouchableOpacity> 
            : 
            null
            }        
          </View>
        </View>
        
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: COLORS.BOTTOMBAR_NOTSELECTED, marginTop: 15, marginBottom: 15 }} />
      </TouchableOpacity>
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
    marginRight: 2,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.DARK,
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT,
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
    marginTop: 2,
    // textDecorationLine: 'line-through'
  },
  finalPriceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.HEAVY,
    color: COLORS.BLACK,
    marginTop: 2
  },
  updateParentView:{
    bottom:2,
    position:'absolute',
    width:windowWidth-h(250),
    alignItems:'center',
    justifyContent:'flex-end',
    padding:3
  }
});
