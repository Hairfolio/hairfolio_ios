import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, windowWidth, showLog } from '../helpers';
import { COLORS, FONTS } from '../style';

export default class ReferAndEarnRow extends React.Component {


  constructor(props){
    super(props)

    showLog("REFER AND EARN ==> "+JSON.stringify(this.props.item))

  }

  render() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          
        <Text style={styles.textTitle}>
          You have earned 
          <Text style={{ fontFamily: FONTS.BLACK }}> {this.props.item.discount_percentage}% </Text>
          discount coupon:
          <Text style={{ fontFamily: FONTS.BLACK, 
                         fontSize:16,
                        }}> {this.props.item.coupon_code} </Text>
        </Text>

        </View>
        <View style={[styles.dividerStyle]} />
      </View>
    );
  }
}
  
const styles = StyleSheet.create({
  parentContainer: {
    width: windowWidth - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  container: {
    flexDirection: "row",
    marginLeft: 5,
    width: windowWidth - 45
  },
  imageStyle: {
    height: 55,
    width: 55,
    borderRadius: 2,
    
  },
  textTitle: {
    fontFamily: FONTS.MEDIUM,
    fontSize:18,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  textBlueTitle: {
    fontFamily: FONTS.BLACK,
    fontSize: 18,
    color: COLORS.LIGHT2
  },
  textDescription: {
    marginTop:5,
    color: COLORS.PLACEHOLDER_SEARCH_FIELD,
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    width:windowWidth - 150
  },
  textContainer: {
    marginLeft: 15,
    width:windowWidth - 60
  },
  dividerStyle: {
    backgroundColor: COLORS.LIGHT4,
    height: 1,
    marginTop: 10
  }
});