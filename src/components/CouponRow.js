import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { Text, View, windowWidth, TouchableOpacity, showLog, showAlert, Image } from '../helpers';
import { COLORS, FONTS } from '../style';
import CouponListStore from '../mobx/stores/hfStore/CouponListStore';

@observer
export default class CouponListRow extends React.Component {

    constructor(props){
        super(props)

        showLog("DATA 1 ==>"+JSON.stringify(props.isSelected))
    }

  render() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          
         {(CouponListStore.selectedID == this.props.item.id) ? 
         
         <TouchableOpacity style={styles.selectedRadio}
            onPress={this.props.onPressItem}>

          <Image style={styles.selectedRadioImg} 
                 source={require('img/radio_btn.png')}/>  
                                                         
          </TouchableOpacity>
        :
        <TouchableOpacity style={styles.unSelectedRadio}
            onPress={this.props.onPressItem}>

           <Image style={styles.unSelectedRadioImg}
                  source={require('img/radio_btn_deselect.png')} 
                  />

          </TouchableOpacity>
        }
           
          <Text style={{ fontFamily: FONTS.BLACK }}> {this.props.item.coupon_code} </Text>

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
    marginTop: 15
  },
  selectedRadio:{ 
    marginRight: 16, 
    height: 20, 
    width: 20, 
    borderRadius:20,
 },
 selectedRadioImg:{ 
  height: 20, 
  width: 20, 
},
 unSelectedRadio:{ 
    marginRight: 16, 
    height: 20, 
    width: 20, 
    borderRadius:20,
},
unSelectedRadioImg:{ 
  height: 20, 
  width: 20, 
}
});