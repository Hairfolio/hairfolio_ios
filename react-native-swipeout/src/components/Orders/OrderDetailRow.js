import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, h, SCALE } from '../../style';
import { showLog } from '../../helpers';


const OrderDetailRow = observer(({product}) => {
    showLog("DETAILED ORDER DATA ==>"+JSON.stringify(product))
    let productDiscount = parseFloat(product.discount) + parseFloat(product.price)
    let totalPrice = parseFloat(product.product.price) * parseFloat(product.quantity);
    let perDiscount = product.discount

    showLog("PRODUCT DISCOUNT ==>"+parseFloat(product.discount))
    showLog("PRODUCT PRICE ==>"+parseFloat(product.price))
    showLog("PRODUCT TOTAL ==>"+JSON.stringify(productDiscount))
    let placeholder_icon = require('img/medium_placeholder_icon.png');

    return(
      <View>
        <View style={styles.rowDirectionWrapper}>
          <View style={styles.imageWrapper}>
          {
            product.product.product_thumb != "" ?
              <Image
              style={styles.productImage}
              onError={()=>{
                product.product.product_thumb = product.product.product_image.url
              }}
              defaultSource={placeholder_icon}
              source={{uri:product.product.product_thumb}}
            />
            :

            <Image
                 style={styles.productImage}
                 source={placeholder_icon}       
          />
        
          }
            
          </View>

          <View style={styles.productDesc}>
            <Text style={styles.labelProductTitleText}>{product.product.name}</Text>
            {
              (product.product.product_brand != null) ?
              <Text style={styles.labelTextLight}>{product.product.product_brand.title}</Text>
              :
              null
            }
            <Text style={styles.labelProductTitleText}>Quantity: {product.quantity}</Text>
            {perDiscount > 0 ? 
              <Text style={styles.strikePriceLabelText}>${totalPrice.toFixed(2)}</Text>
                :
              null
            }
            {perDiscount > 0 ? 
            <Text style={styles.labelProductTitleText}>Discount: ${perDiscount.toFixed(2)}</Text>
            :
            null
            }
          </View>

          <View style={styles.imgWrap}>

            <View style={{ flexDirection: 'row' }}>
              {(perDiscount > 0) ?
                <Text style={styles.priceLabelText}>${((product.product.price*product.quantity)-perDiscount).toFixed(2)}</Text> 
                
                :
                <Text style={styles.priceLabelText}>${(product.product.price*product.quantity).toFixed(2)}</Text>
              }

            </View>

          </View>
        </View>
        <View style={{height: StyleSheet.hairlineWidth, backgroundColor:COLORS.BOTTOMBAR_NOTSELECTED, marginTop:15, marginBottom:15}}/>
      </View>
    )
  
  });
  
export default OrderDetailRow;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between" 
  },
  productImage: {
    borderRadius: 5,
    flex:1,
    // height: h(220),
    width: h(220),
    resizeMode:'contain' 
  },
  imageWrapper:{
    height: h(220),
    width: h(220), 
    borderRadius: 5,
    justifyContent:'center',
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    } 
  },
  imgWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding:15
  },
  qtyImg: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding:5,    
  },
  outline:{
    width: 15,
    height: 15,
    borderRadius: 7,
    borderWidth:0.5,
    justifyContent:"center",
    alignItems:"center"
  },
  labelText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    padding:5
  },
  rowDirectionWrapper:{
    flexDirection:'row'
  },
  productDesc:{
    flex:1,
    padding:15
  },
  labelProductTitleText:{
    fontSize: SCALE.h(27),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK
  },
  labelTextLight: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.ROMAN,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  priceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    color:COLORS.BLACK,
    marginTop:2,
    // textDecorationLine: 'line-through'
  },
  strikePriceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    color:COLORS.GRAY2,
    marginTop:2,
    textDecorationLine: 'line-through'
  },
  finalPriceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    color:COLORS.BLACK,
    marginTop:2,
  },
});
  