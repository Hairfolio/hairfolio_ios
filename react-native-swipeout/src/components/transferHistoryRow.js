import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { windowWidth, showLog, moment, showAlert } from '../helpers';
import { COLORS, FONTS, SCALE } from '../style';

const TransferHistoryRow = observer(({ transfer }) => {

  getTransactionDate = (date) => {
    if (date) {
      return moment(date).format("DD MMMM YYYY, hh:mm a")
    }
    else {
      return "";
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.detailView}>
        <Text style={styles.title}>Id:  {transfer.transaction_id}</Text>
        <Text style={styles.price}>Pay Amount: ${transfer.total_amount}</Text>
        <Text style={styles.price}>Deposit Amount: ${transfer.amount}</Text>
        <Text style={styles.price}>Transaction Date: {this.getTransactionDate(transfer.created_at)}</Text>
      </View>

    </View>
  )

});
  
export default TransferHistoryRow;

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
      // width:windowWidth-((windowWidth/4)-20)-30
      width:windowWidth
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