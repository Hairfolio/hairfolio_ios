import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { Text, View, windowWidth, TouchableOpacity, showLog, showAlert, Image, windowHeight } from '../helpers';
import { COLORS, FONTS } from '../style';
import CardListStore from '../mobx/stores/hfStore/CardAndPlaceOrderStore';

@observer
export default class CardListRow extends React.Component {

    constructor(props){
        super(props)

        showLog("DATA 1 ==>"+JSON.stringify(props.isSelected))
    }

  render() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          
         {(CardListStore.selectedID == this.props.item.id) ? 
         
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
           
         <View style={styles.cardParentView}>
         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Card Number</Text>
            <Text style={[styles.textTitle,{marginLeft:15}]}>{this.props.item.card_number}</Text>
         </View>   

         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Expiry month</Text>
            <Text style={[styles.textTitle,{marginLeft:15}]}>{this.props.item.exp_month}</Text>
         </View> 

         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Expiry year</Text>
            <Text style={[styles.textTitle,{marginLeft:15}]}>{this.props.item.exp_year}</Text>
         </View> 

         {/* <View style={[styles.cardStyleTextInput, { width: windowWidth / 3 - 20, alignItems: "center" }]}> */}
         {(this.props.item.brand == "Visa")?
                <Image source={require("img/visa_icon.png")} style={styles.imgView2} />
                :
                <Image source={require("img/master_card_icon.png")} style={styles.imgView2} />
         }
                
              {/* </View> */}

         </View>

        </View>
        {/* <View style={[styles.dividerStyle]} /> */}
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
},
cardStyleTextInput: {
    // width: windowWidth - 30,
    marginTop: 7
 },
 imgView2: {
    height: 25,
    marginLeft:5,
    marginTop:10,
    // width:80,
    resizeMode: "contain"
  },
 cardParentView:{
    height:windowHeight/6,
    width:windowWidth/1.4,
    backgroundColor:COLORS.WHITE5,
    borderRadius:5,
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.8,
      // width: 1.2
},
 

}
});