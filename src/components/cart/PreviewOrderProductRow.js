import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, h, SCALE } from '../../style';
import { showLog } from '../../helpers';


const PreviewOrderProductRow = observer(({product}) => {
  
  showLog("PREVIEW ORDER PRODUCT ROW ==> "+JSON.stringify(product))
  let placeholder_icon = require('img/medium_placeholder_icon.png');
    return(
      <View>
        <View style={styles.rowDirectionWrapper}>
          <View style={styles.imageWrapper}>
          {
            (product.product.product_thumb && product.product.product_thumb != "") ?
              <Image
              style={styles.productImage}
              defaultSource={placeholder_icon}
              onError={()=>{
                // product.product.product_thumb = product.product.product_image.url
              }}
              source={{uri:product.product.product_thumb}}
             
            />
            :

            <Image
                 style={styles.productImage}
              source={require('img/medium_placeholder_icon.png')}       
          />
        
          }
            
          </View>

          <View style={styles.productDesc}>
            <Text style={styles.labelProductTitleText}>{product.product.name}</Text>
            {
              (product.product.product_brand != null) ?
              <Text numberOfLines={2} style={styles.labelTextLight}>{product.product.product_brand.title}</Text>
              :
              null
            }
            <Text style={styles.labelProductTitleText}>Quantity:{product.units}</Text>
            {/* <Text style={styles.labelTextLight}>Jetblack Ltd </Text>
            <View style={[styles.rowDirectionWrapper, {alignItems:'center'}]}>
              <Text style={styles.labelTextLight}>Color </Text>
              <View style={{ backgroundColor: COLORS.BLACK, width: 10, height: 10}}></View>
            </View> */}
          </View>

          {/* <View style={styles.imgWrap}>
            <Text style={styles.priceLabelText}>${product.product.price}</Text> 
          </View> */}
          {(product.product.discount_percentage != null) ?
            
            <View style={{marginTop:15}}>
              <View style={{ flexDirection: 'row'}}>
                <Text style={styles.priceLabelText}>${product.product.price}</Text>
                <Text style={[styles.finalPriceLabelText, { marginLeft: 10 }]}>${product.product.final_price}</Text>
              </View>
              <Text style={styles.finalPriceLabelText}>{product.product.discount_percentage}% off</Text>
            </View>

            :
            <View style={{padding:15}}>
              <Text style={[styles.finalPriceLabelText, { color: COLORS.BLACK } ]}> ${product.product.final_price}</Text>
            </View>
            }
        </View>
        <View style={{height: StyleSheet.hairlineWidth, backgroundColor:COLORS.BOTTOMBAR_NOTSELECTED, marginTop:15, marginBottom:15}}/>
      </View>
    )
  
  });
  
export default PreviewOrderProductRow;

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
    height: null,
    width: h(220), 
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
  