import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { windowWidth } from '../../helpers';
import { COLORS, FONTS, SCALE } from '../../style';



export default class CartAddress_Text_Input extends Component {    
    
    constructor(props) {
        super(props);
      }

    render(){
        return(
         <View style={styles.cardStyleTextInput}>
            <TextInput style={styles.textInputStyle} 
                   placeholder={this.props.placeholder}
                   onChangeText={this.props.onChangeText} 
                   value={this.props.value}
                   keyboardType={this.props.keyboardType}
                   maxLength={this.props.maxLength}
                   placeholderTextColor={COLORS.DARK} />
            </View>
       );
    }
   
  
  }
  

const styles = StyleSheet.create({
    cardStyleTextInput: {
        width: windowWidth - 30,
        backgroundColor: COLORS.WHITE,
        padding: 5,
        elevation: 1,
        shadowOpacity: 0.10,
        shadowOffset: {
          height: 1.2,
          width: 1.2,
        },
        marginTop: 7
      },
      textInputStyle: {
        width: windowWidth - 40,
        height: SCALE.h(80),
        fontSize: SCALE.h(25),
        fontFamily: FONTS.LIGHT,
        color: COLORS.BLACK,
        paddingLeft: 5,
      }

});
  