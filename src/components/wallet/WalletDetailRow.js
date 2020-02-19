import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { windowWidth } from '../../helpers';
import { COLORS, FONTS, SCALE } from '../../style';

const WalletDetailRow = observer(({wallet}) => {
    
    return(
      <View style={styles.container}>
        <View style={styles.imageView}>
            <Image source={wallet.image} />
        </View>
        <View style={styles.detailView}>
            <Text style={styles.title}>{wallet.name}</Text>
            <Text style={styles.subTitle} numberOfLines={2}>{wallet.details}</Text>
            <Text style={styles.price}>{wallet.price}</Text>
        </View>
          
      </View>
    )
  
  });
  
export default WalletDetailRow;

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
      width:(windowWidth/4)-20,
      padding:10,
      justifyContent:'center',
      alignItems:'center' 
  },
  detailView:{
      marginLeft:10,
      width:windowWidth-((windowWidth/4)-20)-30
  },
  title:{
    fontFamily:FONTS.ROMAN,
    fontSize:SCALE.h(35),
    color:COLORS.DARK
  },
  subTitle:{
    fontFamily:FONTS.LIGHT,
    fontSize:SCALE.h(25),
    color:COLORS.DARK2,
    width:(windowWidth/2)+60
  },
  price:{
    fontFamily:FONTS.ROMAN,
    fontSize:SCALE.h(35),
    color:COLORS.DARK
  }
});  