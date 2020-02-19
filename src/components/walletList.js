import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { windowWidth, showLog } from '../helpers';
import { COLORS, FONTS, SCALE } from '../style';

const WalletListRow = observer(({wallet}) => {
  let placeholder_icon = require('img/medium_placeholder_icon.png');
    return(
      <View style={styles.container}>
        <View style={styles.imageView}>
            <Image style={{height:50,width:50,resizeMode:'contain',flex:1}} 
                    defaultSource={placeholder_icon}
                    source={{uri:(wallet.product.product_thumb) ?  wallet.product.product_thumb : placeholder_icon}}
                    />
        </View>
        <View style={styles.detailView}>
            <Text style={styles.title}>{wallet.product.name}</Text>
            <View style={styles.subTitle}>
                <Text style={styles.price}>Order Id: {wallet.order_id}</Text>
                <Text style={styles.price}>Quantity: {wallet.quantity}</Text>
            </View>
            <Text style={styles.price} numberOfLines={1}>Commission: ${wallet.commission_amount}</Text>
            {/* <Text style={styles.price}>Total: {wallet.total}</Text> */}
        </View>
          
      </View>
    )
  
  });
  
export default WalletListRow;

const styles = StyleSheet.create({
  container:{
      backgroundColor:COLORS.WHITE,
      width:windowWidth,
      padding:16,
      flexDirection:'row',
      marginTop:5,
      marginBottom:5
  },
  imageView:{
      backgroundColor:COLORS.WHITE,
      elevation: 1,
      shadowOpacity: 0.10,
      shadowOffset: {
        height: 1.2,
        width: 1.2
      },
      // height:100,
      // width:100,
      width:(windowWidth/4)-20,
      padding:10,
      justifyContent:'center',
      alignItems:'center',
      
  },
  detailView:{
      marginLeft:10,
      width:windowWidth-((windowWidth/4)-20)-30
  },
  title:{
    fontFamily:FONTS.ROMAN,
    fontSize:SCALE.h(33),
    color:COLORS.DARK
  },
  subTitle:{
    width:(windowWidth/2)+60,
    // backgroundColor:'red',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  subTitle_Old:{
    fontFamily:FONTS.LIGHT,
    fontSize:SCALE.h(23),
    color:COLORS.DARK2,
    width:(windowWidth/2)+60
  },
  price:{
    fontFamily:FONTS.ROMAN,
    fontSize:SCALE.h(33),
    color:COLORS.DARK
  }
});  