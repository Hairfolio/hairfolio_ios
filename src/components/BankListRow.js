import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { Text, View, windowWidth, TouchableOpacity, showLog, showAlert, Image, windowHeight, h } from '../helpers';
import { COLORS, FONTS } from '../style';
import BankAccountStore from '../mobx/stores/hfStore/BankAccountStore';

@observer
export default class CardListRow extends React.Component {

    constructor(props){
        super(props)

        showLog("DATA 1 ==>"+JSON.stringify(this.props.item))
        if(this.props.item.default_for_currency)
        {
          BankAccountStore.selectedID = this.props.item.id
          BankAccountStore.selectedData = this.props.item
        }

    }

  render() {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          
         {(BankAccountStore.selectedID == this.props.item.id) ? 
         
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

         <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>{this.props.item.account_holder_name.toUpperCase()}</Text>
            {(BankAccountStore.selectedID != this.props.item.id) ?
                     <Text style={styles.textSave}
                           onPress={()=>{
                            BankAccountStore.deleteAccount(this.props.item.id)
                           }}
                           >DELETE</Text> :
                           null }
         </View>  

         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Bank Name : </Text>
            <Text style={[styles.textTitle,{marginLeft:0}]}>{this.props.item.bank_name}</Text>
         </View>  

         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Account Number : </Text>
            <Text style={[styles.textTitle,{marginLeft:0}]}>{this.props.item.account_number}</Text>
         </View>

         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Routing Number : </Text>
            <Text style={[styles.textTitle,{marginLeft:0}]}>{this.props.item.routing_number}</Text>
         </View>
         
         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Currency : </Text>
            <Text style={[styles.textTitle,{marginLeft:0}]}>{this.props.item.currency.toUpperCase()}</Text>
         </View> 

         <View style={{flexDirection:'row'}}>
            <Text style={[styles.textTitle,{marginLeft:10}]}>Country : </Text>
            <Text style={[styles.textTitle,{marginLeft:0}]}>{this.props.item.country}</Text>
         </View> 

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
    fontSize:16,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
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
  textSave: {
    fontFamily: FONTS.ROMAN,
    fontSize: h(30),
    color: COLORS.RED,
    // marginTop: 15,
    textAlignVertical:'center',
    alignSelf:'flex-end'
  },
 cardParentView:{
    // height:windowHeight/6,
    width:windowWidth/1.3,
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